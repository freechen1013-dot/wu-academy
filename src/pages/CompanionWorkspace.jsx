import { useEffect, useState } from "react";

const api = "/api/partner-project";
const consentText =
  "本內容將會在審核通過後永久於本學院官網刊登，可能被任何造訪此網頁的人瀏覽。勾選此欄表示同意公開您輸入與上傳的所有內容。另外，若您的回答包含不當之內容，審核該題目的講師有權阻止此內容的上架。";

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

export default function CompanionWorkspace() {
  const [code, setCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    nickname: "",
    response: "",
    consent: false,
  });
  const [edit, setEdit] = useState({
    id: "",
    editCode: "",
    nickname: "",
    response: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    request("")
      .then(setProject)
      .catch((loadError) => setError(loadError.message));
  }, []);

  async function login(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await request("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (data.role !== "student")
        throw new Error("此登入碼僅供講師或管理者使用，請前往審閱工作台。");
      setLoggedIn(true);
      setCode("");
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!project?.activeWeek) return;
    setError("");
    setSubmitting(true);
    const body = new FormData();
    body.append("weekId", project.activeWeek.id);
    body.append("nickname", form.nickname);
    body.append("response", form.response);
    body.append("consent", String(form.consent));
    try {
      const data = await request("/submissions", { method: "POST", body });
      setSuccess(data);
      setForm({ nickname: "", response: "", consent: false });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateSubmission(event, withdraw = false) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const body = withdraw
        ? { editCode: edit.editCode, action: "withdraw" }
        : edit;
      const data = await request(
        `/submissions/${encodeURIComponent(edit.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      setNotice(
        withdraw
          ? "投稿已撤回。"
          : `投稿已更新，現為 ${data.status === "pending" ? "待審閱" : data.status}。`,
      );
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function loadSubmissionStatus() {
    setError("");
    setNotice("");
    setSubmissionStatus(null);
    try {
      const data = await request(
        `/submissions/${encodeURIComponent(edit.id)}/status?editCode=${encodeURIComponent(edit.editCode)}`,
      );
      setSubmissionStatus(data);
    } catch (statusError) {
      setError(statusError.message);
    }
  }

  async function logout() {
    await request("/logout", { method: "POST" }).catch(() => {});
    setLoggedIn(false);
    setSuccess(null);
    setNotice("");
  }

  const week = project?.activeWeek;
  return (
    <section className="bg-gradient-to-b from-sky-50 via-white to-white py-12 md:py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <p className="text-wu-blue font-bold tracking-widest text-sm">
            BORDERLESS COMPANION PROJECT
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-wu-black mt-2">
            跨界共學工作台
          </h1>
          <p className="text-gray-500 mt-3">
            使用暱稱投稿，不蒐集或顯示真實姓名。關閉瀏覽器後登入工作階段會結束，請重新輸入學員碼。
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
        {notice && (
          <p className="mb-5 rounded-xl bg-green-50 border border-green-200 text-green-700 p-4">
            {notice}
          </p>
        )}
        {!loggedIn ? (
          <form
            onSubmit={login}
            className="max-w-md bg-white border border-gray-100 shadow-lg rounded-2xl p-6"
          >
            <h2 className="font-black text-xl">學員登入</h2>
            <label className="block text-sm font-bold mt-5 mb-2">
              學員碼
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3"
              />
            </label>
            <button className="w-full bg-wu-blue text-white font-bold rounded-lg py-3 mt-4">
              進入工作台
            </button>
          </form>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={logout}
                className="text-sm font-bold text-gray-500 hover:text-wu-black"
              >
                登出
              </button>
            </div>
            {week ? (
              <div className="bg-wu-black text-white rounded-2xl p-6 md:p-8 mb-6">
                <p className="text-wu-yellow font-bold">
                  第 {week.weekNumber} 週
                </p>
                <h2 className="text-2xl md:text-3xl font-black mt-2">
                  {week.title}
                </h2>
                {week.titleEn && (
                  <p className="text-gray-400 mt-1">{week.titleEn}</p>
                )}
                <p className="mt-5 whitespace-pre-wrap leading-7">
                  {week.question}
                </p>
                {week.questionEn && (
                  <p className="mt-2 text-gray-300">{week.questionEn}</p>
                )}
                {week.materials?.length > 0 && (
                  <div className="mt-5">
                    <p className="font-bold">參考素材</p>
                    {week.materials.map((material, index) => (
                      <a
                        key={material.url || index}
                        href={material.url || material}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 mr-3 text-wu-yellow underline"
                      >
                        {material.title || material.name || `素材 ${index + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                目前沒有開放中的任務。
              </div>
            )}
            {success ? (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 mb-6">
                <h2 className="font-black text-xl text-green-900">
                  投稿已送出
                </h2>
                <p className="mt-3 text-green-800">
                  請立即保存以下資訊。遺失編輯碼後無法協助找回，也無法查詢投稿狀態。
                </p>
                <dl className="mt-4 grid gap-3 font-mono">
                  <div>
                    <dt className="font-sans text-sm text-green-700">
                      投稿 ID
                    </dt>
                    <dd className="break-all bg-white p-3 rounded">
                      {success.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-sm text-green-700">編輯碼</dt>
                    <dd className="break-all bg-white p-3 rounded">
                      {success.editCode}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              week && (
                <form
                  onSubmit={submit}
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 md:p-8"
                >
                  <h2 className="font-black text-2xl">提交你的回應</h2>
                  <label className="block font-bold mt-5">
                    暱稱
                    <input
                      required
                      maxLength="40"
                      value={form.nickname}
                      onChange={(e) =>
                        setForm({ ...form, nickname: e.target.value })
                      }
                      className="mt-2 w-full border border-gray-300 rounded-lg p-3"
                    />
                  </label>
                  <label className="block font-bold mt-5">
                    回應
                    <textarea
                      required
                      maxLength="4000"
                      rows="7"
                      value={form.response}
                      onChange={(e) =>
                        setForm({ ...form, response: e.target.value })
                      }
                      className="mt-2 w-full border border-gray-300 rounded-lg p-3"
                    />
                  </label>
                  <label className="flex gap-3 items-start mt-6 p-4 bg-yellow-50 rounded-xl">
                    <input
                      required
                      checked={form.consent}
                      onChange={(e) =>
                        setForm({ ...form, consent: e.target.checked })
                      }
                      type="checkbox"
                      className="mt-1"
                    />
                    <span className="text-sm leading-6">{consentText}</span>
                  </label>
                  <button
                    disabled={submitting}
                    className="mt-6 bg-wu-blue text-white font-bold rounded-lg py-3 px-6 disabled:opacity-50"
                  >
                    {submitting ? "送出中..." : "送出投稿"}
                  </button>
                </form>
              )
            )}
            <form
              onSubmit={updateSubmission}
              className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6"
            >
              <h2 className="font-black text-xl">修改或撤回投稿</h2>
              <p className="text-sm text-gray-500 mt-2">
                填入投稿成功時保存的 ID 與編輯碼。已核准的投稿無法變更。
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  required
                  placeholder="投稿 ID"
                  value={edit.id}
                  onChange={(e) => setEdit({ ...edit, id: e.target.value })}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  required
                  placeholder="編輯碼"
                  value={edit.editCode}
                  onChange={(e) =>
                    setEdit({ ...edit, editCode: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-3"
                />
                <input
                  required
                  maxLength="40"
                  placeholder="新暱稱（修改時必填）"
                  value={edit.nickname}
                  onChange={(e) =>
                    setEdit({ ...edit, nickname: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-3"
                />
                <textarea
                  required
                  maxLength="4000"
                  placeholder="新回應（修改時必填）"
                  value={edit.response}
                  onChange={(e) =>
                    setEdit({ ...edit, response: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <button className="bg-wu-black text-white font-bold rounded-lg py-2 px-4">
                  儲存修改
                </button>
                <button
                  type="button"
                  onClick={loadSubmissionStatus}
                  className="border border-wu-blue text-wu-blue font-bold rounded-lg py-2 px-4"
                >
                  查詢投稿狀態
                </button>
                <button
                  type="button"
                  onClick={(e) => updateSubmission(e, true)}
                  className="border border-red-300 text-red-700 font-bold rounded-lg py-2 px-4"
                >
                  撤回投稿
                </button>
              </div>
              {submissionStatus && (
                <div className="mt-5 rounded-xl bg-white border border-gray-200 p-4 text-sm">
                  <p className="font-bold">
                    投稿狀態：
                    {{
                      pending: "待審閱",
                      revision_requested: "需修訂",
                      approved: "已核准",
                      withdrawn: "已撤回",
                    }[submissionStatus.status] || submissionStatus.status}
                  </p>
                  {submissionStatus.reviewNote && (
                    <p className="mt-3 whitespace-pre-wrap">
                      審閱原因：{submissionStatus.reviewNote}
                    </p>
                  )}
                  {submissionStatus.feedback && (
                    <p className="mt-3 whitespace-pre-wrap">
                      最終回饋：{submissionStatus.feedback}
                    </p>
                  )}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
