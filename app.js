const STORAGE_KEY = "ngr-ai-autoname-rules";
const SCHEME_KEY = "ngr-ai-autoname-rule-schemes";
const AI_SETTINGS_KEY = "ngr-ai-autoname-ai-settings";
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

const defaultRules = {
  schemeName: "默认方案",
  basePrefix: "T_UI",
  projectName: "工程名",
  separator: "_",
  tags: "BG, Button, Hover, Normal, Icon, Module",
  pageTerms: "Home\nLogin\nProfile\nSettings",
  componentTerms: "BG\nButton\nIcon\nBanner\nNav\nModule",
  stateTerms: "Normal\nHover\nActive\nDisabled",
  filenameRules: "首页=Home\n主页=Home\n登录=Login\n登陆=Login\n个人中心=Profile\n我的=Profile\n设置=Settings\n背景=BG\n底图=BG\n按钮=Button\n图标=Icon\n导航=Nav\n横幅=Banner\n模块=Module\n常态=Normal\n默认=Normal\n悬浮=Hover\n选中=Active\n点击=Active\n禁用=Disabled\n不可用=Disabled\nbg=BG\nbackground=BG\nbtn=Button\nbutton=Button\nicon=Icon\nhover=Hover\nactive=Active\ndisabled=Disabled\nhome=Home\nlogin=Login\nuser=Profile",
};

const builtinTranslations = {
  首页: "Home",
  主页: "Home",
  登录: "Login",
  登陆: "Login",
  个人中心: "Profile",
  我的: "Profile",
  设置: "Settings",
  背景: "BG",
  底图: "BG",
  按钮: "Button",
  图标: "Icon",
  导航: "Nav",
  横幅: "Banner",
  模块: "Module",
  常态: "Normal",
  默认: "Normal",
  悬浮: "Hover",
  选中: "Active",
  点击: "Active",
  禁用: "Disabled",
  不可用: "Disabled",
};

let rules = loadRules();
let schemes = loadSchemes();
let aiSettings = loadAiSettings();
let assets = [];
let selectedId = null;
let referenceFile = null;
let namingController = null;
let stopRequested = false;
let toastTimer = null;

const els = {
  backButton: document.querySelector("#backButton"),
  pageHint: document.querySelector("#pageHint"),
  views: {
    home: document.querySelector("#homeView"),
    rules: document.querySelector("#rulesView"),
    work: document.querySelector("#workView"),
  },
  rulesEntry: document.querySelector("#rulesEntry"),
  workEntry: document.querySelector("#workEntry"),
  schemeSelect: document.querySelector("#schemeSelect"),
  schemeName: document.querySelector("#schemeName"),
  basePrefix: document.querySelector("#basePrefix"),
  projectName: document.querySelector("#projectName"),
  workProjectName: document.querySelector("#workProjectName"),
  separator: document.querySelector("#separator"),
  tags: document.querySelector("#tags"),
  pageTerms: document.querySelector("#pageTerms"),
  componentTerms: document.querySelector("#componentTerms"),
  stateTerms: document.querySelector("#stateTerms"),
  filenameRules: document.querySelector("#filenameRules"),
  aiProvider: document.querySelector("#aiProvider"),
  aiApiFormat: document.querySelector("#aiApiFormat"),
  aiBaseUrl: document.querySelector("#aiBaseUrl"),
  openaiApiKey: document.querySelector("#openaiApiKey"),
  openaiModel: document.querySelector("#openaiModel"),
  aiProviderNote: document.querySelector("#aiProviderNote"),
  exportSchemeTemplate: document.querySelector("#exportSchemeTemplate"),
  importSchemeTemplate: document.querySelector("#importSchemeTemplate"),
  prefixPreview: document.querySelector("#prefixPreview"),
  saveRules: document.querySelector("#saveRules"),
  saveAsScheme: document.querySelector("#saveAsScheme"),
  resetRules: document.querySelector("#resetRules"),
  activeRuleText: document.querySelector("#activeRuleText"),
  folderInput: document.querySelector("#folderInput"),
  singleInput: document.querySelector("#singleInput"),
  referenceInput: document.querySelector("#referenceInput"),
  referencePreviewWrap: document.querySelector("#referencePreviewWrap"),
  referencePreview: document.querySelector("#referencePreview"),
  referenceName: document.querySelector("#referenceName"),
  assetList: document.querySelector("#assetList"),
  fileCount: document.querySelector("#fileCount"),
  runNaming: document.querySelector("#runNaming"),
  stopNaming: document.querySelector("#stopNaming"),
  exportFiles: document.querySelector("#exportFiles"),
  batchSuffix: document.querySelector("#batchSuffix"),
  applySuffix: document.querySelector("#applySuffix"),
  removeSelected: document.querySelector("#removeSelected"),
  toast: document.querySelector("#toast"),
};

init();

function init() {
  bindNavigation();
  bindRules();
  bindUploads();
  bindEditor();
  fillRulesForm();
  fillAiSettings();
  upsertScheme(rules);
  renderSchemeSelect();
  updateRulePreview();
  updateActiveRuleText();
}

function bindNavigation() {
  els.rulesEntry.addEventListener("click", () => showView("rules"));
  els.workEntry.addEventListener("click", () => showView("work"));
  els.backButton.addEventListener("click", () => showView("home"));
}

function showView(name) {
  Object.entries(els.views).forEach(([key, node]) => node.classList.toggle("active", key === name));
  els.backButton.classList.toggle("hidden", name === "home");
  const hints = {
    home: "批量整理 UI 切图名称，让文件名保持统一、清楚、可追踪。",
    rules: "配置全局命名前缀、分隔符与通用标签。工程名可在开始命名页按当前界面填写。",
    work: "填写当前界面工程名，上传切图后可在每张图片旁边直接改名。",
  };
  els.pageHint.textContent = hints[name];
}

function bindRules() {
  [els.schemeName, els.basePrefix, els.projectName, els.separator, els.tags, els.pageTerms, els.componentTerms, els.stateTerms, els.filenameRules].forEach((input) => {
    input.addEventListener("input", () => {
      rules = collectRulesForm();
      if (input === els.projectName) els.workProjectName.value = rules.projectName;
      updateRulePreview();
      updateActiveRuleText();
      renderAssetList();
    });
  });

  els.schemeSelect.addEventListener("change", () => {
    const selected = schemes.find((scheme) => scheme.schemeName === els.schemeSelect.value);
    if (!selected) return;
    rules = normalizeLoadedRules({ ...defaultRules, ...selected });
    saveRules(rules);
    fillRulesForm();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已切换命名方案");
  });

  els.workProjectName.addEventListener("input", () => {
    rules.projectName = sanitizeName(els.workProjectName.value) || defaultRules.projectName;
    els.projectName.value = rules.projectName;
    saveRules(rules);
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
  });

  els.saveRules.addEventListener("click", () => {
    rules = collectRulesForm();
    saveRules(rules);
    upsertScheme(rules);
    fillRulesForm();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("命名规则已保存");
  });

  els.saveAsScheme.addEventListener("click", () => {
    rules = collectRulesForm();
    saveRules(rules);
    upsertScheme(rules);
    fillRulesForm();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已保存为方案：" + rules.schemeName);
  });

  els.resetRules.addEventListener("click", () => {
    rules = { ...defaultRules };
    saveRules(rules);
    upsertScheme(rules);
    fillRulesForm();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已恢复默认规则");
  });

  [els.aiProvider, els.aiApiFormat, els.aiBaseUrl, els.openaiApiKey, els.openaiModel, els.aiProviderNote].forEach((input) => {
    input.addEventListener("input", () => {
      aiSettings = collectAiSettings();
      saveAiSettings(aiSettings);
    });
  });

  els.aiProvider.addEventListener("change", () => {
    applyProviderPreset();
    aiSettings = collectAiSettings();
    saveAiSettings(aiSettings);
  });

  els.exportSchemeTemplate.addEventListener("click", exportSchemeTemplate);
  els.importSchemeTemplate.addEventListener("change", importSchemeTemplate);
}

function bindUploads() {
  els.folderInput.addEventListener("change", (event) => addFiles([...event.target.files]));
  els.singleInput.addEventListener("change", (event) => addFiles([...event.target.files]));
  els.referenceInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    referenceFile = file;
    els.referencePreview.src = URL.createObjectURL(file);
    els.referenceName.textContent = file.name;
    els.referencePreviewWrap.classList.remove("hidden");
    showToast("参考效果图已载入");
  });
}

function bindEditor() {
  els.runNaming.addEventListener("click", runNaming);
  els.stopNaming.addEventListener("click", stopNaming);
  els.applySuffix.addEventListener("click", applyBatchSuffix);
  els.removeSelected.addEventListener("click", removeSelectedAssets);
  els.exportFiles.addEventListener("click", exportRenamedFiles);
}

async function runNaming() {
  if (!assets.length) {
    showToast("请先上传切图文件");
    return;
  }
  const apiKey = aiSettings.apiKey.trim();
  stopRequested = false;
  assets.forEach((asset) => {
    asset.namingStatus = "pending";
    asset.statusMessage = "";
  });
  setRunButtonLoading(true, "AI 命名中 0/" + assets.length);
  renderAssetList();

  for (let index = 0; index < assets.length; index += 1) {
    if (stopRequested) break;
    const asset = assets[index];
    const localRecommendations = makeRecommendations(asset);
    let recommendations = localRecommendations;
    asset.namingStatus = "running";
    asset.statusMessage = "正在处理第 " + (index + 1) + " 张";
    setRunButtonLoading(true, "AI 命名中 " + index + "/" + assets.length);
    renderAssetList();

    try {
      if (apiKey) {
        namingController = new AbortController();
        recommendations = await requestAiRecommendations(asset, localRecommendations, namingController.signal);
      }
      asset.recommendations = recommendations.length ? recommendations : localRecommendations;
      asset.finalBaseName = asset.finalBaseName || asset.recommendations[0];
      asset.namingStatus = "done";
      asset.statusMessage = apiKey ? "AI 命名完成" : "本地规则完成";
    } catch (error) {
      if (stopRequested || error.name === "AbortError") {
        asset.namingStatus = "pending";
        asset.statusMessage = "已终止，未完成命名";
        break;
      }
      asset.recommendations = localRecommendations;
      asset.finalBaseName = asset.finalBaseName || localRecommendations[0];
      asset.namingStatus = "failed";
      asset.statusMessage = "AI 失败，已使用本地推荐";
    }
    setRunButtonLoading(true, "AI 命名中 " + (index + 1) + "/" + assets.length);
    renderAssetList();
  }

  namingController = null;
  setRunButtonLoading(false);
  renderAssetList();
  showToast(stopRequested ? "已终止命名" : apiKey ? "AI 推荐命名已完成" : "已使用本地知识库生成推荐名称");
}

function setRunButtonLoading(isLoading, label = "运行 AI 命名") {
  els.runNaming.disabled = isLoading;
  els.runNaming.textContent = label;
  els.stopNaming.disabled = false;
  els.stopNaming.textContent = "终止命名";
  els.stopNaming.classList.toggle("hidden", !isLoading);
}

function stopNaming() {
  stopRequested = true;
  if (namingController) namingController.abort();
  els.stopNaming.disabled = true;
  els.stopNaming.textContent = "终止中";
  showToast("正在终止命名");
}

async function requestAiRecommendations(asset, localRecommendations, signal) {
  const cutImageUrl = await imageFileToDataUrl(asset.file, 768);
  const referenceImageUrl = referenceFile && isRasterImage(referenceFile) ? await imageFileToDataUrl(referenceFile, 960) : "";
  const prompt = buildAiPrompt(asset, localRecommendations);
  const apiFormat = aiSettings.apiFormat || "responses";
  const response = await fetch(buildAiEndpoint(apiFormat), {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + aiSettings.apiKey.trim(),
    },
    body: JSON.stringify(apiFormat === "chat" ? buildChatPayload(prompt, cutImageUrl, referenceImageUrl) : buildResponsesPayload(prompt, cutImageUrl, referenceImageUrl)),
  });

  if (!response.ok) {
    throw new Error("AI request failed");
  }
  const data = await response.json();
  const text = extractResponseText(data);
  return normalizeAiNames(parseAiNames(text), localRecommendations);
}

function buildResponsesPayload(prompt, cutImageUrl, referenceImageUrl) {
  const content = [
    {
      type: "input_text",
      text: prompt,
    },
    {
      type: "input_image",
      image_url: cutImageUrl,
      detail: "low",
    },
  ];
  if (referenceImageUrl) {
    content.push({
      type: "input_image",
      image_url: referenceImageUrl,
      detail: "low",
    });
  }
  return {
    model: aiSettings.model.trim() || "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content,
      },
    ],
  };
}

function buildChatPayload(prompt, cutImageUrl, referenceImageUrl) {
  const content = [
    {
      type: "text",
      text: prompt,
    },
    {
      type: "image_url",
      image_url: { url: cutImageUrl, detail: "low" },
    },
  ];
  if (referenceImageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: referenceImageUrl, detail: "low" },
    });
  }
  return {
    model: aiSettings.model.trim() || "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content,
      },
    ],
  };
}

function buildAiEndpoint(apiFormat) {
  const baseUrl = normalizeBaseUrl(aiSettings.baseUrl || "https://api.openai.com/v1");
  if (/\/(responses|chat\/completions)$/i.test(baseUrl)) return baseUrl;
  return baseUrl + (apiFormat === "chat" ? "/chat/completions" : "/responses");
}

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function applyProviderPreset() {
  const provider = els.aiProvider.value;
  if (provider === "openai") {
    els.aiBaseUrl.value = "https://api.openai.com/v1";
    els.aiApiFormat.value = "responses";
    if (!els.openaiModel.value.trim()) els.openaiModel.value = "gpt-4.1-mini";
    return;
  }
  if (provider === "compatible") {
    els.aiApiFormat.value = "chat";
    if (!els.aiBaseUrl.value.trim() || els.aiBaseUrl.value.includes("api.openai.com")) els.aiBaseUrl.value = "https://你的模型服务地址/v1";
  }
}

function buildAiPrompt(asset, localRecommendations) {
  return [
    "你是 UI 切图命名助手。请根据切图图片、参考效果图、原始文件名和团队命名知识库，生成 2 到 5 个英文语义名称。",
    "只返回 JSON，格式为：{\"names\":[\"Login_Button_Hover\",\"Home_BG\"]}。",
    "不要包含固定前缀、工程名、文件扩展名。名称只允许英文字母、数字和下划线，使用 Pascal/Title 英文词组并以下划线连接。",
    "原始文件名：" + asset.originalBase + asset.extension,
    "当前前缀：" + buildPrefix(),
    "本地候选：" + localRecommendations.join(", "),
    "页面词库：" + parseList(rules.pageTerms).join(", "),
    "组件词库：" + parseList(rules.componentTerms).join(", "),
    "状态词库：" + parseList(rules.stateTerms).join(", "),
    "文件名匹配规则：" + parseFilenameRules(rules.filenameRules).map((rule) => rule.keyword + "=" + rule.value).join(", "),
  ].join("\n");
}

function extractResponseText(data) {
  if (data.output_text) return data.output_text;
  const chatText = data.choices?.[0]?.message?.content;
  if (Array.isArray(chatText)) return chatText.map((part) => part.text || "").join("\n");
  if (typeof chatText === "string") return chatText;
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .join("\n");
}

function parseAiNames(text) {
  const raw = String(text || "").trim();
  try {
    const parsed = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
    if (Array.isArray(parsed.names)) return parsed.names;
  } catch {
    // Fall through to line-based parsing.
  }
  return raw
    .split(/[\n,，]/)
    .map((item) => item.replace(/^[-*\d.]+/, "").trim())
    .filter(Boolean);
}

function normalizeAiNames(names, fallback) {
  const normalized = names
    .map((name) => sanitizeName(name))
    .filter(Boolean)
    .filter((name) => /^[A-Za-z0-9_]+$/.test(name));
  return [...new Set(normalized)].slice(0, 5).length ? [...new Set(normalized)].slice(0, 5) : fallback;
}

async function imageFileToDataUrl(file, maxSide) {
  if (!isRasterImage(file)) {
    throw new Error("Unsupported image type for AI");
  }
  const originalUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(originalUrl);
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(originalUrl);
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function isRasterImage(file) {
  return /image\/(png|jpeg|jpg|webp)/i.test(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name);
}

function applyBatchSuffix() {
  const suffix = sanitizeName(els.batchSuffix.value);
  if (!suffix) {
    showToast("请先输入要追加的后缀");
    return;
  }
  const selected = assets.filter((asset) => asset.checked);
  const targets = selected.length ? selected : assets;
  targets.forEach((asset) => {
    const base = asset.finalBaseName || makeRecommendations(asset)[0];
    asset.finalBaseName = appendPart(base, suffix);
  });
  renderAssetList();
  showToast("已更新 " + targets.length + " 张图片");
}

function removeSelectedAssets() {
  const targetIds = assets.filter((asset) => asset.checked || asset.id === selectedId).map((asset) => asset.id);
  if (!targetIds.length) return;
  assets = assets.filter((asset) => !targetIds.includes(asset.id));
  if (!assets.some((asset) => asset.id === selectedId)) selectedId = assets[0]?.id || null;
  renderAssetList();
  showToast("已删除选中的图片");
}

async function addFiles(files) {
  const imageFiles = files.filter(isSupportedImage);
  if (!imageFiles.length) {
    showToast("未发现可处理的图片文件");
    return;
  }

  const additions = await Promise.all(imageFiles.map(fileToAsset));
  const seen = new Set(assets.map((asset) => asset.key));
  additions.forEach((asset) => {
    if (!seen.has(asset.key)) {
      assets.push(asset);
      seen.add(asset.key);
    }
  });
  if (!selectedId && assets.length) selectedId = assets[0].id;
  renderAssetList();
  showToast("已载入 " + additions.length + " 张切图");
}

function isSupportedImage(file) {
  return IMAGE_TYPES.includes(file.type) || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
}

async function fileToAsset(file) {
  const url = URL.createObjectURL(file);
  const dimensions = await readImageDimensions(url).catch(() => ({ width: 0, height: 0 }));
  const originalBase = file.name.replace(/\.[^.]+$/, "");
  const extension = getExtension(file.name);
  const id = crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random();
  const key = (file.webkitRelativePath || file.name) + "-" + file.size + "-" + file.lastModified;
  return {
    id,
    key,
    file,
    url,
    originalBase,
    extension,
    dimensions,
    checked: false,
    recommendations: [],
    finalBaseName: "",
    namingStatus: "idle",
    statusMessage: "",
  };
}

function readImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

function renderAssetList() {
  els.fileCount.textContent = assets.length + " 张";
  if (!assets.length) {
    els.assetList.className = "asset-list-body empty-state";
    els.assetList.textContent = "请先上传切图文件夹";
    return;
  }

  els.assetList.className = "asset-list-body";
  els.assetList.innerHTML = "";
  assets.forEach((asset) => {
    const row = document.createElement("div");
    row.className = "asset-item" + (asset.id === selectedId ? " active" : "");
    row.addEventListener("click", () => {
      selectedId = asset.id;
      renderAssetList();
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = asset.checked;
    checkbox.addEventListener("click", (event) => event.stopPropagation());
    checkbox.addEventListener("change", (event) => {
      event.stopPropagation();
      asset.checked = checkbox.checked;
    });

    const img = document.createElement("img");
    img.src = asset.url;
    img.alt = asset.originalBase;

    const text = document.createElement("div");
    text.className = "asset-meta";
    const beforeName = createMetaLine("修改前名称", asset.originalBase + asset.extension);
    const afterName = createMetaLine("修改后名称", asset.finalBaseName ? buildExportName(asset) : "待命名");
    const resolution = createMetaLine("分辨率", formatResolution(asset.dimensions));
    const status = document.createElement("span");
    status.className = "status-badge status-" + getAssetStatus(asset);
    status.textContent = getAssetStatusText(asset);
    const statusHint = document.createElement("em");
    statusHint.textContent = asset.statusMessage || "";
    text.append(beforeName, afterName, resolution, status, statusHint);

    const editor = document.createElement("div");
    editor.className = "inline-editor";
    editor.addEventListener("click", (event) => event.stopPropagation());

    const prefix = document.createElement("div");
    prefix.className = "inline-prefix";
    const prefixLabel = document.createElement("span");
    prefixLabel.textContent = "已选前缀";
    const prefixValue = document.createElement("strong");
    prefixValue.textContent = buildPrefix();
    prefix.append(prefixLabel, prefixValue);

    const recommendationWrap = document.createElement("div");
    recommendationWrap.className = "inline-recommendations";
    const recommendationLabel = document.createElement("span");
    recommendationLabel.textContent = "AI 推荐命名";
    const recommendationButtons = document.createElement("div");
    recommendationButtons.className = "recommendations compact";
    const recommendations = asset.recommendations.length ? asset.recommendations : makeRecommendations(asset);
    recommendations.forEach((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "recommendation";
      button.textContent = name;
      button.addEventListener("click", () => {
        asset.finalBaseName = name;
        renderAssetList();
        showToast("已填入推荐名称");
      });
      recommendationButtons.appendChild(button);
    });
    recommendationWrap.append(recommendationLabel, recommendationButtons);

    const finalLabel = document.createElement("label");
    finalLabel.className = "inline-final-name";
    const finalText = document.createElement("span");
    finalText.textContent = "最终名称";
    const finalInput = document.createElement("input");
    finalInput.type = "text";
    finalInput.value = asset.finalBaseName;
    finalInput.placeholder = "请选择推荐名称或手动输入";
    finalInput.addEventListener("input", () => {
      asset.finalBaseName = sanitizeName(finalInput.value);
      afterName.querySelector("strong").textContent = asset.finalBaseName ? buildExportName(asset) : "待命名";
    });
    finalLabel.append(finalText, finalInput);

    editor.append(prefix, recommendationWrap, finalLabel);
    row.append(checkbox, img, text, editor);
    els.assetList.appendChild(row);
  });
}

function createMetaLine(label, value) {
  const line = document.createElement("div");
  line.className = "meta-line";
  const labelNode = document.createElement("span");
  labelNode.textContent = label;
  const valueNode = document.createElement("strong");
  valueNode.textContent = value;
  line.append(labelNode, valueNode);
  return line;
}

function formatResolution(dimensions) {
  if (!dimensions?.width || !dimensions?.height) return "无法读取";
  return dimensions.width + " x " + dimensions.height;
}

function getAssetStatus(asset) {
  if (asset.namingStatus && asset.namingStatus !== "idle") return asset.namingStatus;
  return asset.finalBaseName ? "done" : "pending";
}

function getAssetStatusText(asset) {
  const status = getAssetStatus(asset);
  const labels = {
    pending: "待命名",
    running: "命名中",
    done: "已完成",
    failed: "失败",
  };
  return labels[status] || "待命名";
}

function makeRecommendations(asset) {
  const source = normalizeSourceName(asset.originalBase);
  const knowledge = parseKnowledge();
  const mapped = inferMappedTerms(source, knowledge);
  const tags = parseTags(rules.tags);
  const translatedSource = translateFilename(source, knowledge);
  const kind = mapped.component || inferKind(asset, source, tags, knowledge.componentTerms);
  const page = mapped.page || inferPage(source, knowledge.pageTerms);
  const state = mapped.state || inferState(source, knowledge.stateTerms);
  const candidates = [
    compactParts([page, kind, state]),
    compactParts([kind, state]),
    compactParts([translatedSource || kind]),
    compactParts([page, pickTerm(knowledge.componentTerms, "Module", tags.includes("Module") ? "Module" : "模块")]),
    compactParts([kind, pickTerm(knowledge.stateTerms, "Normal", tags.includes("Normal") ? "Normal" : "常态")]),
    ...mapped.direct,
  ];
  return [...new Set(candidates.map(sanitizeName).filter(Boolean))].slice(0, 5);
}

function inferKind(asset, source, tags, componentTerms = []) {
  const lower = source.toLowerCase();
  const translated = translateTextByDictionary(source).toLowerCase();
  if (/bg|background|背景/.test(lower)) return pickTerm(componentTerms, "BG", pickTag(tags, "BG", "背景"));
  if (/btn|button|按钮/.test(lower)) return pickTerm(componentTerms, "Button", pickTag(tags, "Button", "按钮"));
  if (/icon|ico|图标/.test(lower)) return pickTerm(componentTerms, "Icon", pickTag(tags, "Icon", "图标"));
  if (/logo/.test(lower)) return pickTerm(componentTerms, "Logo", "Logo");
  if (/banner|横幅/.test(lower)) return pickTerm(componentTerms, "Banner", "Banner");
  if (/tab|nav|导航/.test(lower)) return pickTerm(componentTerms, "Nav", "Nav");
  if (/button/.test(translated)) return pickTerm(componentTerms, "Button", pickTag(tags, "Button", "Button"));
  if (/icon/.test(translated)) return pickTerm(componentTerms, "Icon", pickTag(tags, "Icon", "Icon"));
  const { width, height } = asset.dimensions;
  if (width && height && width > height * 2.6) return pickTerm(componentTerms, "Banner", "Banner");
  if (width && height && Math.abs(width - height) < 8 && width <= 160) return pickTerm(componentTerms, "Icon", pickTag(tags, "Icon", "图标"));
  if (width && height && width >= 600 && height >= 300) return pickTerm(componentTerms, "BG", pickTag(tags, "BG", "背景"));
  return pickTerm(componentTerms, "Module", pickTag(tags, "Module", "模块"));
}

function inferPage(source, pageTerms = []) {
  const lower = source.toLowerCase();
  const matched = matchTerm(source, pageTerms);
  if (matched) return matched;
  if (/home|index|首页|主页/.test(lower)) return pickTerm(pageTerms, "Home", "Home");
  if (/login|signin|登录|登陆/.test(lower)) return pickTerm(pageTerms, "Login", "Login");
  if (/user|profile|mine|个人|我的/.test(lower)) return pickTerm(pageTerms, "Profile", "Profile");
  if (/setting|settings|设置/.test(lower)) return pickTerm(pageTerms, "Settings", "Settings");
  return "";
}

function inferState(source, stateTerms = []) {
  const lower = source.toLowerCase();
  const matched = matchTerm(source, stateTerms);
  if (matched) return matched;
  if (/hover|悬浮/.test(lower)) return pickTerm(stateTerms, "Hover", "Hover");
  if (/active|selected|pressed|选中|点击/.test(lower)) return pickTerm(stateTerms, "Active", "Active");
  if (/disabled|disable|禁用|不可用/.test(lower)) return pickTerm(stateTerms, "Disabled", "Disabled");
  if (/normal|default|常态|默认/.test(lower)) return pickTerm(stateTerms, "Normal", "Normal");
  return "";
}

function pickTag(tags, preferred, fallback) {
  return tags.find((tag) => tag.toLowerCase() === preferred.toLowerCase()) || fallback;
}

function pickTerm(terms, preferred, fallback) {
  return terms.find((term) => term.toLowerCase() === String(preferred).toLowerCase()) || fallback;
}

function matchTerm(source, terms) {
  const lower = source.toLowerCase();
  return terms.find((term) => lower.includes(term.toLowerCase())) || "";
}

function parseKnowledge() {
  return {
    pageTerms: parseList(rules.pageTerms),
    componentTerms: parseList(rules.componentTerms),
    stateTerms: parseList(rules.stateTerms),
    filenameRules: parseFilenameRules(rules.filenameRules),
  };
}

function inferMappedTerms(source, knowledge) {
  const lower = source.toLowerCase();
  const direct = [];
  let page = "";
  let component = "";
  let state = "";
  knowledge.filenameRules.forEach((rule) => {
    if (!lower.includes(rule.keyword.toLowerCase())) return;
    const translatedValue = translateRuleValue(rule.value);
    direct.push(translatedValue);
    if (!page && knowledge.pageTerms.some((term) => sameTerm(term, translatedValue) || sameTerm(term, rule.value))) page = translatedValue;
    if (!component && knowledge.componentTerms.some((term) => sameTerm(term, translatedValue) || sameTerm(term, rule.value))) component = translatedValue;
    if (!state && knowledge.stateTerms.some((term) => sameTerm(term, translatedValue) || sameTerm(term, rule.value))) state = translatedValue;
  });
  return { page, component, state, direct };
}

function translateFilename(source, knowledge) {
  const mappedValues = [];
  const lower = source.toLowerCase();
  knowledge.filenameRules.forEach((rule) => {
    if (lower.includes(rule.keyword.toLowerCase())) mappedValues.push(translateRuleValue(rule.value, knowledge));
  });
  if (mappedValues.length) return compactParts([...new Set(mappedValues)]);
  return translateTextByDictionary(source)
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9_]+/g, "_");
}

function translateRuleValue(value) {
  return builtinTranslations[value] || value;
}

function translateTextByDictionary(value) {
  let result = String(value || "");
  Object.entries(builtinTranslations)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([zh, en]) => {
      result = result.split(zh).join("_" + en + "_");
    });
  return result;
}

function sameTerm(a, b) {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

function normalizeSourceName(name) {
  return name
    .replace(/^(@\d+x|icon-|img-|image-|切图_|切图-)/i, "")
    .replace(/[\s-]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");
}

function compactParts(parts) {
  return parts.filter(Boolean).join("_");
}

function sanitizeName(name) {
  return String(name || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function appendPart(base, part) {
  const cleanBase = sanitizeName(base);
  const cleanPart = sanitizeName(part);
  if (!cleanBase) return cleanPart;
  if (!cleanPart || cleanBase.endsWith("_" + cleanPart)) return cleanBase;
  return cleanBase + "_" + cleanPart;
}

async function exportRenamedFiles() {
  if (!assets.length) {
    showToast("没有可导出的图片");
    return;
  }
  const incomplete = assets.find((asset) => !asset.finalBaseName);
  if (incomplete) {
    selectedId = incomplete.id;
    renderAssetList();
    showToast("还有图片没有最终名称，请先确认");
    return;
  }

  if ("showDirectoryPicker" in window) {
    try {
      const dir = await window.showDirectoryPicker({ mode: "readwrite" });
      for (const asset of assets) {
        const fileHandle = await dir.getFileHandle(buildExportName(asset), { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(asset.file);
        await writable.close();
      }
      showToast("导出完成，可在所选文件夹查看");
    } catch (error) {
      if (error.name !== "AbortError") showToast("导出失败，请检查浏览器文件夹权限");
    }
    return;
  }

  assets.forEach((asset) => {
    const link = document.createElement("a");
    link.href = asset.url;
    link.download = buildExportName(asset);
    link.click();
  });
  showToast("浏览器不支持选择文件夹，已改为逐个下载");
}

function buildExportName(asset) {
  return buildPrefix() + sanitizeName(asset.finalBaseName) + asset.extension;
}

function getExtension(name) {
  const match = name.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : ".png";
}

function collectRulesForm() {
  return {
    schemeName: els.schemeName.value.trim() || defaultRules.schemeName,
    basePrefix: sanitizeName(els.basePrefix.value) || defaultRules.basePrefix,
    projectName: sanitizeName(els.workProjectName.value || els.projectName.value) || defaultRules.projectName,
    separator: els.separator.value || defaultRules.separator,
    tags: els.tags.value.trim() || defaultRules.tags,
    pageTerms: els.pageTerms.value.trim() || defaultRules.pageTerms,
    componentTerms: els.componentTerms.value.trim() || defaultRules.componentTerms,
    stateTerms: els.stateTerms.value.trim() || defaultRules.stateTerms,
    filenameRules: els.filenameRules.value.trim() || defaultRules.filenameRules,
  };
}

function fillRulesForm() {
  els.schemeName.value = rules.schemeName;
  els.basePrefix.value = rules.basePrefix;
  els.projectName.value = rules.projectName;
  els.workProjectName.value = rules.projectName;
  els.separator.value = rules.separator;
  els.tags.value = rules.tags;
  els.pageTerms.value = rules.pageTerms;
  els.componentTerms.value = rules.componentTerms;
  els.stateTerms.value = rules.stateTerms;
  els.filenameRules.value = rules.filenameRules;
}

function fillAiSettings() {
  els.aiProvider.value = aiSettings.provider;
  els.aiApiFormat.value = aiSettings.apiFormat;
  els.aiBaseUrl.value = aiSettings.baseUrl;
  els.openaiApiKey.value = aiSettings.apiKey;
  els.openaiModel.value = aiSettings.model;
  els.aiProviderNote.value = aiSettings.providerNote;
}

function exportSchemeTemplate() {
  const current = collectRulesForm();
  const workbook = buildExcelTemplate(current);
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizeName(current.schemeName) + "_命名方案模板.xls";
  link.click();
  URL.revokeObjectURL(url);
  showToast("已导出多页签方案模板");
}

async function importSchemeTemplate(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = parseSchemeTemplate(text, file.name);
    rules = normalizeLoadedRules({ ...defaultRules, ...imported });
    saveRules(rules);
    upsertScheme(rules);
    fillRulesForm();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已导入方案模板：" + rules.schemeName);
  } catch (error) {
    showToast("导入失败，请检查模板格式");
  } finally {
    event.target.value = "";
  }
}

function buildExcelTemplate(current) {
  const pageRows = parseList(current.pageTerms).map((value, index) => [index + 1, value, "页面英文名，用于生成 Home_BG 等名称"]);
  const componentRows = parseList(current.componentTerms).map((value, index) => [index + 1, value, "组件英文名，用于识别按钮、背景、图标等"]);
  const stateRows = parseList(current.stateTerms).map((value, index) => [index + 1, value, "状态英文名，用于 Normal、Hover 等交互状态"]);
  const ruleRows = parseFilenameRules(current.filenameRules).map((rule) => [rule.keyword, rule.value, "原始文件名包含关键词时，自动转换为英文名"]);
  const sheets = [
    {
      name: "使用说明",
      rows: [
        ["AI辅助UI切图命名工具 - 方案模板"],
        ["请在各页签中修改“值”或词库内容，保存后回到网页导入。"],
        ["基础配置页：维护方案名称、固定前缀、工程名、分隔符、常用标签。"],
        ["页面词库/组件词库/状态词库：每行填写一个英文命名词。"],
        ["文件名匹配规则：第一列填写中文或英文关键词，第二列填写转换后的英文名。"],
        ["不要修改页签名称和表头，否则可能无法导入。"],
      ],
    },
    {
      name: "基础配置",
      rows: [
        ["字段", "值", "说明"],
        ["方案名称", current.schemeName, "自定义方案名称，会显示在网页的选择方案下拉框中"],
        ["固定前缀", current.basePrefix, "例如 T_UI"],
        ["工程名", current.projectName, "当前项目或界面工程名，也可在开始命名页临时修改"],
        ["分隔符", current.separator, "推荐使用 _"],
        ["常用标签", current.tags, "多个标签可用英文逗号分隔"],
      ],
    },
    {
      name: "页面词库",
      rows: [["序号", "页面英文名", "说明"], ...pageRows],
    },
    {
      name: "组件词库",
      rows: [["序号", "组件英文名", "说明"], ...componentRows],
    },
    {
      name: "状态词库",
      rows: [["序号", "状态英文名", "说明"], ...stateRows],
    },
    {
      name: "文件名匹配规则",
      rows: [["原始文件名关键词", "转换后的英文名", "说明"], ...ruleRows],
    },
  ];
  return [
    '<?xml version="1.0"?>',
    '<?mso-application progid="Excel.Sheet"?>',
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
    '<Styles><Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#DCEEEF" ss:Pattern="Solid"/></Style></Styles>',
    sheets.map((sheet) => buildWorksheet(sheet.name, sheet.rows)).join(""),
    "</Workbook>",
  ].join("");
}

function buildWorksheet(name, rows) {
  return [
    '<Worksheet ss:Name="' + xmlEscape(name) + '"><Table>',
    rows.map((row, rowIndex) => {
      const style = rowIndex === 0 ? ' ss:StyleID="Header"' : "";
      return "<Row>" + row.map((cell) => '<Cell' + style + '><Data ss:Type="String">' + xmlEscape(cell) + "</Data></Cell>").join("") + "</Row>";
    }).join(""),
    "</Table></Worksheet>",
  ].join("");
}

function parseSchemeTemplate(text, fileName) {
  if (/\.csv$/i.test(fileName) || !text.trim().startsWith("<")) {
    return parseSchemeTemplateCsv(text);
  }
  return parseSchemeTemplateWorkbook(text);
}

function parseSchemeTemplateWorkbook(text) {
  const xml = new DOMParser().parseFromString(text, "text/xml");
  if (xml.querySelector("parsererror")) throw new Error("Invalid Excel XML");
  const next = { ...defaultRules };
  const pageTerms = readWorksheetValues(xml, "页面词库", 1);
  const componentTerms = readWorksheetValues(xml, "组件词库", 1);
  const stateTerms = readWorksheetValues(xml, "状态词库", 1);
  const rulesRows = readWorksheetRows(xml, "文件名匹配规则").slice(1);
  const baseRows = readWorksheetRows(xml, "基础配置").slice(1);
  baseRows.forEach(([field, value]) => {
    const cleanField = String(field || "").trim();
    const cleanValue = String(value || "").trim();
    if (cleanField === "方案名称") next.schemeName = cleanValue || defaultRules.schemeName;
    if (cleanField === "固定前缀") next.basePrefix = cleanValue || defaultRules.basePrefix;
    if (cleanField === "工程名") next.projectName = cleanValue || defaultRules.projectName;
    if (cleanField === "分隔符") next.separator = cleanValue || defaultRules.separator;
    if (cleanField === "常用标签") next.tags = cleanValue || defaultRules.tags;
  });
  if (pageTerms.length) next.pageTerms = pageTerms.join("\n");
  if (componentTerms.length) next.componentTerms = componentTerms.join("\n");
  if (stateTerms.length) next.stateTerms = stateTerms.join("\n");
  const filenameRules = rulesRows
    .map(([keyword, value]) => [String(keyword || "").trim(), String(value || "").trim()])
    .filter(([keyword, value]) => keyword && value)
    .map(([keyword, value]) => keyword + "=" + value);
  if (filenameRules.length) next.filenameRules = filenameRules.join("\n");
  return next;
}

function readWorksheetValues(xml, sheetName, columnIndex) {
  return readWorksheetRows(xml, sheetName)
    .slice(1)
    .map((row) => String(row[columnIndex] || "").trim())
    .filter(Boolean);
}

function readWorksheetRows(xml, sheetName) {
  const worksheet = [...xml.getElementsByTagName("Worksheet")].find((sheet) => sheet.getAttribute("ss:Name") === sheetName || sheet.getAttribute("Name") === sheetName);
  if (!worksheet) return [];
  return [...worksheet.getElementsByTagName("Row")].map((row) => [...row.getElementsByTagName("Cell")].map((cell) => {
    const data = cell.getElementsByTagName("Data")[0];
    return data ? data.textContent : "";
  }));
}

function parseSchemeTemplateCsv(text) {
  const rows = parseCsv(text.replace(/^\ufeff/, ""));
  const next = { ...defaultRules };
  const pageTerms = [];
  const componentTerms = [];
  const stateTerms = [];
  const filenameRules = [];
  rows.slice(1).forEach(([moduleName, field, value]) => {
    const cleanModule = String(moduleName || "").trim();
    const cleanField = String(field || "").trim();
    const cleanValue = String(value || "").trim();
    if (!cleanModule || !cleanField) return;
    if (cleanModule === "基础配置") {
      if (cleanField === "方案名称") next.schemeName = cleanValue || defaultRules.schemeName;
      if (cleanField === "固定前缀") next.basePrefix = cleanValue || defaultRules.basePrefix;
      if (cleanField === "工程名") next.projectName = cleanValue || defaultRules.projectName;
      if (cleanField === "分隔符") next.separator = cleanValue || defaultRules.separator;
      if (cleanField === "常用标签") next.tags = cleanValue || defaultRules.tags;
    }
    if (cleanModule === "页面词库" && cleanValue) pageTerms.push(cleanValue);
    if (cleanModule === "组件词库" && cleanValue) componentTerms.push(cleanValue);
    if (cleanModule === "状态词库" && cleanValue) stateTerms.push(cleanValue);
    if (cleanModule === "文件名匹配规则" && cleanField && cleanValue) filenameRules.push(cleanField + "=" + cleanValue);
  });
  if (pageTerms.length) next.pageTerms = pageTerms.join("\n");
  if (componentTerms.length) next.componentTerms = componentTerms.join("\n");
  if (stateTerms.length) next.stateTerms = stateTerms.join("\n");
  if (filenameRules.length) next.filenameRules = filenameRules.join("\n");
  return next;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ",") {
      row.push(cell);
      cell = "";
    } else if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((item) => item.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((item) => item.trim())) rows.push(row);
  return rows;
}

function csvCell(value) {
  const text = String(value || "");
  return '"' + text.replace(/"/g, '""') + '"';
}

function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSchemeSelect() {
  els.schemeSelect.innerHTML = "";
  schemes.forEach((scheme) => {
    const option = document.createElement("option");
    option.value = scheme.schemeName;
    option.textContent = scheme.schemeName;
    option.selected = scheme.schemeName === rules.schemeName;
    els.schemeSelect.appendChild(option);
  });
}

function buildPrefix() {
  const separator = rules.separator || "_";
  return [sanitizeName(rules.basePrefix), sanitizeName(rules.projectName), ""].join(separator);
}

function updateRulePreview() {
  els.prefixPreview.textContent = buildPrefix() + "AI自动生成名称";
}

function updateActiveRuleText() {
  els.activeRuleText.textContent = "当前规则：" + buildPrefix();
}

function parseTags(value) {
  return parseList(value);
}

function parseList(value) {
  return String(value || "")
    .split(/[\n,，、]/)
    .map((item) => sanitizeName(item))
    .filter(Boolean);
}

function parseFilenameRules(value) {
  return String(value || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("=");
      return {
        keyword: sanitizeName(parts[0]),
        value: sanitizeName(parts.slice(1).join("=") || parts[0]),
      };
    })
    .filter((rule) => rule.keyword && rule.value);
}

function loadRules() {
  try {
    return normalizeLoadedRules({ ...defaultRules, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) });
  } catch {
    return { ...defaultRules };
  }
}

function saveRules(nextRules) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRules));
}

function collectAiSettings() {
  return {
    provider: els.aiProvider.value || "openai",
    apiFormat: els.aiApiFormat.value || "responses",
    baseUrl: normalizeBaseUrl(els.aiBaseUrl.value) || "https://api.openai.com/v1",
    apiKey: els.openaiApiKey.value.trim(),
    model: els.openaiModel.value.trim() || "gpt-4.1-mini",
    providerNote: els.aiProviderNote.value.trim(),
  };
}

function loadAiSettings() {
  try {
    return normalizeAiSettings({
      ...readLocalAiConfig(),
      ...JSON.parse(localStorage.getItem(AI_SETTINGS_KEY)),
    });
  } catch {
    return normalizeAiSettings(readLocalAiConfig());
  }
}

function saveAiSettings(nextSettings) {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(nextSettings));
}

function normalizeAiSettings(nextSettings = {}) {
  return {
    provider: nextSettings.provider || "openai",
    apiFormat: nextSettings.apiFormat || "responses",
    baseUrl: normalizeBaseUrl(nextSettings.baseUrl || "https://api.openai.com/v1"),
    apiKey: nextSettings.apiKey || "",
    model: nextSettings.model || "gpt-4.1-mini",
    providerNote: nextSettings.providerNote || "",
  };
}

function readLocalAiConfig() {
  return window.NGR_LOCAL_AI_CONFIG || {};
}

function loadSchemes() {
  try {
    const saved = JSON.parse(localStorage.getItem(SCHEME_KEY));
    if (Array.isArray(saved) && saved.length) return saved.map((scheme) => normalizeLoadedRules(scheme));
  } catch {
    // Ignore invalid local scheme data and rebuild with the default scheme.
  }
  return [normalizeLoadedRules({ ...defaultRules })];
}

function saveSchemes(nextSchemes) {
  localStorage.setItem(SCHEME_KEY, JSON.stringify(nextSchemes));
}

function upsertScheme(nextRules) {
  const clean = normalizeLoadedRules({
    ...defaultRules,
    ...nextRules,
    schemeName: nextRules.schemeName || defaultRules.schemeName,
  });
  const index = schemes.findIndex((scheme) => scheme.schemeName === clean.schemeName);
  if (index >= 0) {
    schemes[index] = clean;
  } else {
    schemes.push(clean);
  }
  schemes.sort((a, b) => a.schemeName.localeCompare(b.schemeName, "zh-Hans-CN"));
  saveSchemes(schemes);
}

function normalizeLoadedRules(nextRules) {
  const merged = { ...defaultRules, ...nextRules };
  merged.filenameRules = mergeRuleText(defaultRules.filenameRules, merged.filenameRules);
  return merged;
}

function mergeRuleText(defaultText, savedText) {
  const savedLines = String(savedText || "").split("\n").filter(Boolean);
  const savedKeys = new Set(savedLines.map((line) => line.split("=")[0].trim().toLowerCase()));
  const missingDefaults = String(defaultText || "")
    .split("\n")
    .filter(Boolean)
    .filter((line) => !savedKeys.has(line.split("=")[0].trim().toLowerCase()));
  return [...savedLines, ...missingDefaults].join("\n");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  toastTimer = window.setTimeout(() => els.toast.classList.add("hidden"), 2600);
}
