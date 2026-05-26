const STORAGE_KEY = "ngr-ai-autoname-rules";
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

const defaultRules = {
  schemeName: "默认方案",
  basePrefix: "T_UI",
  projectName: "工程名",
  separator: "_",
  tags: "BG, Button, Hover, Normal, Icon, Module",
};

let rules = loadRules();
let assets = [];
let selectedId = null;
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
  schemeName: document.querySelector("#schemeName"),
  basePrefix: document.querySelector("#basePrefix"),
  projectName: document.querySelector("#projectName"),
  workProjectName: document.querySelector("#workProjectName"),
  separator: document.querySelector("#separator"),
  tags: document.querySelector("#tags"),
  prefixPreview: document.querySelector("#prefixPreview"),
  saveRules: document.querySelector("#saveRules"),
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
  [els.schemeName, els.basePrefix, els.projectName, els.separator, els.tags].forEach((input) => {
    input.addEventListener("input", () => {
      rules = collectRulesForm();
      if (input === els.projectName) els.workProjectName.value = rules.projectName;
      updateRulePreview();
      updateActiveRuleText();
      renderAssetList();
    });
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
    fillRulesForm();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("命名规则已保存");
  });

  els.resetRules.addEventListener("click", () => {
    rules = { ...defaultRules };
    saveRules(rules);
    fillRulesForm();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已恢复默认规则");
  });
}

function bindUploads() {
  els.folderInput.addEventListener("change", (event) => addFiles([...event.target.files]));
  els.singleInput.addEventListener("change", (event) => addFiles([...event.target.files]));
  els.referenceInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    els.referencePreview.src = URL.createObjectURL(file);
    els.referenceName.textContent = file.name;
    els.referencePreviewWrap.classList.remove("hidden");
    showToast("参考效果图已载入");
  });
}

function bindEditor() {
  els.runNaming.addEventListener("click", () => {
    if (!assets.length) {
      showToast("请先上传切图文件");
      return;
    }
    assets = assets.map((asset) => {
      const recommendations = makeRecommendations(asset);
      return {
        ...asset,
        recommendations,
        finalBaseName: asset.finalBaseName || recommendations[0],
      };
    });
    renderAssetList();
    showToast("已为 " + assets.length + " 张图片生成推荐名称");
  });

  els.applySuffix.addEventListener("click", () => {
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
  });

  els.removeSelected.addEventListener("click", () => {
    const targetIds = assets.filter((asset) => asset.checked || asset.id === selectedId).map((asset) => asset.id);
    if (!targetIds.length) return;
    assets = assets.filter((asset) => !targetIds.includes(asset.id));
    if (!assets.some((asset) => asset.id === selectedId)) selectedId = assets[0]?.id || null;
    renderAssetList();
    showToast("已删除选中的图片");
  });

  els.exportFiles.addEventListener("click", exportRenamedFiles);
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
    const title = document.createElement("strong");
    title.textContent = asset.originalBase;
    const subtitle = document.createElement("span");
    subtitle.textContent = asset.finalBaseName ? buildExportName(asset) : "待命名";
    text.append(title, subtitle);

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
      subtitle.textContent = asset.finalBaseName ? buildExportName(asset) : "待命名";
    });
    finalLabel.append(finalText, finalInput);

    editor.append(prefix, recommendationWrap, finalLabel);
    row.append(checkbox, img, text, editor);
    els.assetList.appendChild(row);
  });
}

function makeRecommendations(asset) {
  const source = normalizeSourceName(asset.originalBase);
  const tags = parseTags(rules.tags);
  const kind = inferKind(asset, source, tags);
  const page = inferPage(source);
  const state = inferState(source);
  const candidates = [
    compactParts([page, kind, state]),
    compactParts([kind, state]),
    compactParts([source || kind]),
    compactParts([page, tags.includes("Module") ? "Module" : "模块"]),
    compactParts([kind, tags.includes("Normal") ? "Normal" : "常态"]),
  ];
  return [...new Set(candidates.map(sanitizeName).filter(Boolean))].slice(0, 5);
}

function inferKind(asset, source, tags) {
  const lower = source.toLowerCase();
  if (/bg|background|背景/.test(lower)) return pickTag(tags, "BG", "背景");
  if (/btn|button|按钮/.test(lower)) return pickTag(tags, "Button", "按钮");
  if (/icon|ico|图标/.test(lower)) return pickTag(tags, "Icon", "图标");
  if (/logo/.test(lower)) return "Logo";
  if (/banner/.test(lower)) return "Banner";
  if (/tab|nav|导航/.test(lower)) return "Nav";
  const { width, height } = asset.dimensions;
  if (width && height && width > height * 2.6) return "Banner";
  if (width && height && Math.abs(width - height) < 8 && width <= 160) return pickTag(tags, "Icon", "图标");
  if (width && height && width >= 600 && height >= 300) return pickTag(tags, "BG", "背景");
  return pickTag(tags, "Module", "模块");
}

function inferPage(source) {
  const lower = source.toLowerCase();
  if (/home|index|首页/.test(lower)) return "首页";
  if (/login|signin|登录/.test(lower)) return "登录";
  if (/user|profile|mine|个人|我的/.test(lower)) return "个人中心";
  if (/setting|设置/.test(lower)) return "设置";
  return "";
}

function inferState(source) {
  const lower = source.toLowerCase();
  if (/hover|悬浮/.test(lower)) return "Hover";
  if (/active|selected|pressed|选中|点击/.test(lower)) return "Active";
  if (/disabled|disable|不可用/.test(lower)) return "Disabled";
  if (/normal|default|常态/.test(lower)) return "Normal";
  return "";
}

function pickTag(tags, preferred, fallback) {
  return tags.find((tag) => tag.toLowerCase() === preferred.toLowerCase()) || fallback;
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
  };
}

function fillRulesForm() {
  els.schemeName.value = rules.schemeName;
  els.basePrefix.value = rules.basePrefix;
  els.projectName.value = rules.projectName;
  els.workProjectName.value = rules.projectName;
  els.separator.value = rules.separator;
  els.tags.value = rules.tags;
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
  return String(value || "")
    .split(/[,，、]/)
    .map((item) => sanitizeName(item))
    .filter(Boolean);
}

function loadRules() {
  try {
    return { ...defaultRules, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaultRules };
  }
}

function saveRules(nextRules) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRules));
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  toastTimer = window.setTimeout(() => els.toast.classList.add("hidden"), 2600);
}
