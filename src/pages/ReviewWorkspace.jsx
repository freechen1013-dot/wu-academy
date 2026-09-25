import { useState } from "react";

const api = "/api/partner-project";

async function request(path, options = {}) {
  const response = await fetch(`${api}${path}`, {
    credentials: "same-origin",
    ...options,
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "請稍後再試");
  }
  return response.status === 204 ? null : response.json();
}

function statusLabel(status) {
  return (
    {
      pending: "待審閱",
      revision_requested: "待修訂",
      approved: "已核准",
      withdrawn: "已撤回",
    }[status] || status
  );
}

export default function ReviewWorkspace() {
  const [code, setCode] = useState("");
  const [account, setAccount] = useState(null);
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState({});
  const [feedback, setFeedback] = useState({});
  const [busy, setBusy] = useState("");

  async function loadQueue() {
    try {
      setQueue(await request("/review-queue"));
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  async function login(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!["lecturer", "director"].includes(data.role))
        throw new Error("此登入碼僅供學員使用，請前往跨界共學工作台。");
      setAccount(data);
      setCode("");
      await loadQueue();
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  async function review(submission, status) {
    const note = notes[submission.id] || "";
    if (status === "revision_requested" && !note.trim()) {
      setError("請填寫需要修訂的原因。");
      return;
    }
    setBusy(submission.id);
    setError("");
    setMessage("");
    try {
      await request(`/submissions/${submission.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          note,
          feedback: feedback[submission.id] || "",
        }),
      });
      setMessage(
        status === "approved"
          ? "已核准投稿並送出最終回饋。"
          : "已請學員修訂，原因已送出。",
      );
      await loadQueue();
    } catch (reviewError) {
      setError(reviewError.message);
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    await request("/logout", { method: "POST" }).catch(() => {});
    setAccount(null);
    setQueue(null);
    setMessage("");
  }

  const weekName = (id) =>
    queue?.weeks.find((week) => week.id === id)?.title_zh || "未命名週次";
  return (
    <section className="bg-gradient-to-b from-yellow-50 via-white to-white py-12 md:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <p className="text-wu-blue font-bold tracking-widest text-sm">
            BORDERLESS REVIEW DESK
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-wu-black mt-2">
            講師審閱工作台
          </h1>
          <p className="text-gray-500 mt-3">
            僅顯示投稿暱稱，不顯示或要求真實姓名。關閉瀏覽器後登入工作階段會結束。
          </p>
        </header>
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 p-4"
          >
            {error}
          </p>
        )}
        {message && (
          <p className="mb-5 rounded-xl bg-green-50 border border-green-200 text-green-700 p-4">
            {message}
          </p>
        )}
        {!account ? (
          <form
            onSubmit={login}
            className="max-w-md bg-white border border-gray-100 shadow-lg rounded-2xl p-6"
          >
            <h2 className="font-black text-xl">講師／管理者登入</h2>
            <label className="block text-sm font-bold mt-5 mb-2">
              工作碼
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3"
              />
            </label>
            <button className="w-full bg-wu-black text-white font-bold rounded-lg py-3 mt-4">
              進入審閱佇列
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {account.role === "director"
                  ? "管理者檢視全部週次"
                  : "講師檢視分派週次"}
              </p>
              <button
                onClick={logout}
                className="text-sm font-bold text-gray-500 hover:text-wu-black"
              >
                登出
              </button>
            </div>
            {!queue ? (
              <p className="text-center py-12">載入中...</p>
            ) : queue.submissions.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                目前沒有投稿紀錄。
              </div>
            ) : (
              <div className="space-y-6">
                {queue.submissions.map((submission) => (
                  <article
                    key={submission.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap gap-3 justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-wu-blue">
                            {weekName(submission.week_id)}{" "}
                            {submission.status === "revision_requested" &&
                              "・已請修訂"}
                          </p>
                          <h2 className="text-xl font-black mt-1">
                            {submission.nickname}
                          </h2>
                          <p className="text-xs text-gray-400 mt-1">
                            投稿於{" "}
                            {new Date(submission.created_at).toLocaleString(
                              "zh-TW",
                            )}
                          </p>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 rounded-full px-3 py-1">
                          {statusLabel(submission.status)}
                        </span>
                      </div>
                      <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-700">
                        {submission.response}
                      </p>
                      {submission.review_note && (
                        <p className="mt-5 bg-yellow-50 p-3 rounded-lg text-sm">
                          審閱原因：{submission.review_note}
                        </p>
                      )}
                      {submission.feedback && (
                        <p className="mt-5 bg-sky-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                          最終回饋：{submission.feedback}
                        </p>
                      )}
                      {["pending", "revision_requested"].includes(
                        submission.status,
                      ) ? (
                        <>
                          <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <label className="text-sm font-bold">
                              最終回饋（核准時送出）
                              <textarea
                                value={feedback[submission.id] || ""}
                                onChange={(e) =>
                                  setFeedback({
                                    ...feedback,
                                    [submission.id]: e.target.value,
                                  })
                                }
                                maxLength="4000"
                                rows="4"
                                className="mt-2 w-full border border-gray-300 rounded-lg p-3 font-normal"
                              />
                            </label>
                            <label className="text-sm font-bold">
                              修訂原因（要求修訂時必填）
                              <textarea
                                value={notes[submission.id] || ""}
                                onChange={(e) =>
                                  setNotes({
                                    ...notes,
                                    [submission.id]: e.target.value,
                                  })
                                }
                                maxLength="4000"
                                rows="4"
                                className="mt-2 w-full border border-gray-300 rounded-lg p-3 font-normal"
                              />
                            </label>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-5">
                            <button
                              disabled={busy === submission.id}
                              onClick={() => review(submission, "approved")}
                              className="bg-wu-blue text-white font-bold rounded-lg px-5 py-3 disabled:opacity-50"
                            >
                              核准並送出回饋
                            </button>
                            <button
                              disabled={busy === submission.id}
                              onClick={() =>
                                review(submission, "revision_requested")
                              }
                              className="border border-wu-black text-wu-black font-bold rounded-lg px-5 py-3 disabled:opacity-50"
                            >
                              要求修訂
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="mt-6 text-sm text-gray-500">
                          此投稿已{statusLabel(submission.status)}，僅供檢視。
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
