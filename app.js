const STORAGE_KEY = "ngr-ai-autoname-rules";
const SCHEME_KEY = "ngr-ai-autoname-rule-schemes";
const PROJECTS_KEY = "ngr-ai-autoname-projects";
const ACTIVE_PROJECT_KEY = "ngr-ai-autoname-active-project";
const AI_SETTINGS_KEY = "ngr-ai-autoname-ai-settings";
const TRANSLATION_SETTINGS_KEY = "ngr-ai-autoname-translation-settings";
const DETECTION_PROFILES_KEY = "ngr-ai-autoname-detection-profiles";
const ACTIVE_DETECTION_PROFILE_KEY = "ngr-ai-autoname-active-detection-profile";
const LIST_DISPLAY_MODE_KEY = "ngr-ai-autoname-list-display-mode";
const LIST_SORT_MODE_KEY = "ngr-ai-autoname-list-sort-mode";
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
const NGR_TRAINING_VERSION = 6;
const YYSLS_TRAINING_VERSION = 1;
const FORBIDDEN_NAMING_TERMS = ["module", "modules"];
const lexiconCategories = [
  { title: "状态", terms: ["Normal", "Nml", "Hover", "Pressed", "Down", "Active", "Selected", "Sel", "Unselected", "Disabled", "Forbidden", "Lock", "Unlock", "Open", "Close", "On", "Off"] },
  { title: "类型", terms: ["BG", "Button", "Btn", "Icon", "Line", "Bar", "ProgressBar", "Frame", "Mask", "Card", "Tab", "Panel", "Item", "Title", "Text", "Number"] },
  { title: "装饰", terms: ["Light", "Shadow", "Pattern", "Ornament", "Deco", "Glow", "Spark", "Ribbon", "Border", "Corner", "Circle", "Bubble", "Point", "Arrow"] },
  { title: "内容", terms: ["Illustration", "Character", "Weapon", "Rewards", "Gift", "Badge", "Logo", "Avatar", "Shop", "Task", "Map", "Skill", "Rank", "Record", "Journal"] },
  { title: "方向", terms: ["Left", "Right", "Top", "Bottom", "Center", "Middle", "Front", "Back", "Corner", "TopLeft", "TopRight", "BottomLeft", "BottomRight"] },
  { title: "颜色", terms: ["Red", "Blue", "Yellow", "Green", "Black", "White", "Gold", "Purple", "Orange", "Gray", "Dark", "Light"] },
];

const defaultRules = {
  schemeName: "默认方案",
  basePrefix: "T_UI",
  projectName: "工程名",
  separator: "_",
  tags: "BG, Button, Hover, Normal, Icon, Item, Frame, Mask, Panel, Title, Line, ProgressBar, Selected, Disabled",
  pageTerms: "Home\nLogin\nProfile\nSettings",
  componentTerms: "BG\nButton\nBtn\nIcon\nBanner\nNav\nItem\nFrame\nMask\nPanel\nCard\nLine\nBar\nProgressBar\nTitle\nText\nNumber\nArrow\nPoint\nBadge\nLogo\nAvatar\nRewards",
  stateTerms: "Normal\nHover\nActive\nDisabled",
  filenameRules: "首页=Home\n主页=Home\n登录=Login\n登陆=Login\n个人中心=Profile\n我的=Profile\n设置=Settings\n背景=BG\n底图=BG\n底=BG\n背景图=BG\n按钮=Button\n图标=Icon\n导航=Nav\n横幅=Banner\n模块=Item\n奖励=Rewards\n常态=Normal\n默认=Normal\n悬浮=Hover\n选中=Active\n点击=Active\n禁用=Disabled\n不可用=Disabled\nbg=BG\nbackground=BG\nBackground=BG\nReward=Rewards\nRewards=Rewards\nbtn=Button\nbutton=Button\nicon=Icon\nhover=Hover\nactive=Active\ndisabled=Disabled\nhome=Home\nlogin=Login\nuser=Profile",
  contextDocs: "",
};

const yyslsTrainingKnowledge = {
  tags: "bg, btn, icon, line, frame, mask, tab, sel, nml, hover, ban, pinyin, lower_case",
  pageTerms: [
    "login", "loading", "face", "career", "huijuan", "task", "home", "mainpage", "nielian", "yuxue", "shequ", "yulan",
    "kaifeng", "qiyu", "fenzhi", "coures", "courses", "dialoge", "bm", "vx", "com", "map", "banner", "menpai",
    "shop", "world", "hud", "skill", "baiye", "wulinlu", "modular", "model", "waiguan", "activity", "collection",
    "player", "talk", "billboard", "buff", "equip", "bangpai", "huizhang", "xinhu", "sundries", "wuxue", "chengjiu",
    "bag", "qishu", "shusheng", "guide", "tianfu", "entity", "hanghui", "pvp", "photo", "setting", "yezixi",
    "xinfa", "building", "reward", "debate", "hangdang", "tyro", "toushi", "fuben", "huisu", "xiaofei", "weather"
  ].join("\n"),
  componentTerms: [
    "bg", "btn", "icon", "line", "frame", "mask", "tab", "item", "title", "pop", "bar", "pro", "slider", "floor",
    "pic", "head", "body", "circle", "light", "shadow", "glow", "dian", "diban", "diwen", "huawen", "zhuangshi",
    "jianbian", "tishi", "erweima", "lunpan", "jindu", "guide", "name", "photo", "share", "voice", "play", "pause",
    "emotion", "ui", "96", "144", "v3", "v2", "01", "02", "03", "04", "head", "qishu", "baiye", "npc", "tips",
    "lizi", "loop", "lod", "kfc", "wave", "decorate", "text", "keyboard", "base", "page", "mobile", "collection",
    "thumbnail", "png", "girl", "black", "white", "gold", "blue", "arrow", "card", "point", "tip", "flow",
    "par", "deco", "flower", "team", "sound", "portrait", "clouds", "fire", "wood"
  ].join("\n"),
  stateTerms: [
    "nml", "sel", "hover", "ban", "focus", "dark", "light", "lock", "unlock", "normal", "selected", "disabled",
    "x", "z", "l", "d", "left", "right", "top", "bottom", "long", "big", "small", "pc", "mobile", "zuo", "you"
  ].join("\n"),
  filenameRules: [
    "常态=nml", "默认=nml", "普通=nml", "选中=sel", "选择=sel", "悬浮=hover", "禁用=ban", "不可用=ban", "焦点=focus",
    "按钮=btn", "背景=bg", "底图=bg", "底=bg", "图标=icon", "线=line", "线条=line", "边框=frame", "遮罩=mask", "标签=tab",
    "渐变=jianbian", "花纹=huawen", "装饰=zhuangshi", "底板=diban", "地板=diban", "底纹=diwen", "二维码=erweima",
    "转盘=lunpan", "进度=jindu", "提示=tishi", "预览=yulan", "社区=shequ", "捏脸=nielian", "选择=xuanze", "引导=guide",
    "左边=zuobian", "右边=youbian", "左=left", "右=right", "黑=dark", "白=light", "亮=light", "暗=dark",
    "bg=bg", "BG=bg", "btn=btn", "Btn=btn", "button=btn", "Button=btn", "icon=icon", "Icon=icon", "line=line", "Line=line",
    "frame=frame", "Frame=frame", "mask=mask", "Mask=mask", "normal=nml", "Normal=nml", "nml=nml", "NML=nml",
    "select=sel", "selected=sel", "Selected=sel", "sel=sel", "hover=hover", "Hover=hover", "disabled=ban", "Disabled=ban",
    "ban=ban", "focus=focus", "dark=dark", "light=light"
  ].join("\n"),
  contextDocs: [
    "燕云十六声 / yysls 历史切图命名习惯：已完整扫描 Resources/png 目录 28080 张 PNG，其中 27025 个文件名为全小写，26315 个使用下划线分段；命名以小写 snake_case 为主，不使用 PascalCase。",
    "命名结构通常为：页面或系统前缀_功能语义_组件类型_状态，例如 login_btn_nml、loading_secrecy_btn_sel、face_create_btn_right_bg_zhu_nml。",
    "中英混合但以拼音为主：nielian、jianbian、huawen、zhuangshi、diban、erweima、xuanze、yulan、shequ、lunpan、zuobian、youbian 等可直接作为命名词。",
    "高频页面/系统前缀包括：vx、com、map、home、banner、ui、menpai、shop、icon、head、world、hud、skill、task、baiye、wulinlu、modular、model、face、waiguan、activity、collection、player、talk、equip、wuxue、hanghui。",
    "英文多用短词或缩写：bg、btn、icon、line、frame、mask、tab、item、title、pop、bar、pro、slider、pic、head、circle、light、glow、shadow、guide、mask。",
    "状态词固定倾向：nml=常态，sel=选中，hover=悬浮，ban=禁用，focus=焦点；不要生成 Normal、Selected、Disabled 这类长英文状态词。",
    "最终名称必须保持全小写 snake_case，用下划线连接；如果中文原名包含拼音习惯词，优先保留拼音而不是翻译成长英文。"
  ].join("\n")
};

const builtinSchemes = [
  {
    ...defaultRules,
    schemeName: "NGR图集命名规范",
    projectName: "NGR",
    contextDocs: "该项目由驼峰命名规则首字母大写。命名应优先使用英文 Pascal Case 词组但要支持公认的缩写英文，并用下划线连接，例如 Home_Button_Normal。",
  },
  {
    ...defaultRules,
    schemeName: "yysls命名规范",
    projectName: "yysls",
    tags: yyslsTrainingKnowledge.tags,
    pageTerms: yyslsTrainingKnowledge.pageTerms,
    componentTerms: yyslsTrainingKnowledge.componentTerms,
    stateTerms: yyslsTrainingKnowledge.stateTerms,
    filenameRules: defaultRules.filenameRules + "\n" + yyslsTrainingKnowledge.filenameRules,
    contextDocs: yyslsTrainingKnowledge.contextDocs,
  },
  {
    ...defaultRules,
    schemeName: "更多项目正在持续开发中",
    projectName: "More",
    contextDocs: "占位项目配置。后续可以复制或修改为新的项目命名规范。",
  },
];

const ngrTrainingKnowledge = {
  projectTerms: [
    "Modules", "SkillPanel", "Mall", "RPVPArena", "Keyboard", "Reward", "Toast", "PVPBRMap", "MainHUD", "ActivityChessMiniGame", "Homestead",
    "Plateau", "NewBattle", "Lottery", "MainHUDStatic", "PVPTeam", "Setting", "MallS1", "Team", "MissionHandbook", "Intimacy",
    "PVPMidBattle", "SocialChat", "ActivityVegetableXiaoXiaoLe", "PVPBattleCommon", "QuestGuide", "SceneryRecord", "BattlePass", "PVPBR",
    "FengyunFestival", "CreationBox", "ActivitySanrio", "GuanDan", "S1SeasonInterface", "ActivityHonorOfKingsLinkage", "RPVPTourArena",
    "Indicator", "RPVPArenaBroadcast", "MissionCalendar", "Gamepad", "VegetableFairySkateboard", "PVPBRSystemBroadcast", "RoleViewing",
    "ImageJumpping", "UserLogin", "Personalization", "Appearance", "TopLog", "Weapon", "Cultivate", "MainRole", "Map", "MusicFestival",
    "RPVPArenaLoading", "RPVPArenaMatch", "Identification", "RPVPPick", "Fishing", "RPVPRankReview", "PVPBRHall", "Battle", "Schools",
    "PVPBag", "RPVPArenaOver", "Skill", "HeroicChronicles", "PVPLobby", "PVPLogin", "NewbieTask", "CreateRole", "ActivityRoleLiBai",
    "Credit", "AchievementCenter", "RPVPWristSeal", "SocialBadge", "BackFlow", "Decompose", "SailNote", "ActivityTips", "DailyCheckIn",
    "ClimbingFestival", "Illustration", "RPVPArenaPrep", "BlindBox", "WristSealSkills", "PVPBRSkillPanel", "MainHUDMenu", "Achievement",
    "PVPBRTopLog", "EquipmentMake", "ActivityCharacterChallenge", "ItemNotice"
  ],
  componentTerms: [
    "BG", "Bg", "Button", "Btn", "Icon", "Banner", "Nav", "Item", "Line", "Bar", "ProgressBar", "Frame", "Mask", "Light",
    "Pattern", "Tab", "Card", "Item", "Panel", "Container", "Arrow", "Sprite", "Title", "Text", "Txt", "Number", "Num", "Point",
    "Circle", "Bubble", "Logo", "Tag", "Lock", "Unlock", "Popup", "Toast", "Broadcast", "Recommend", "Rewards", "GloryRewards", "Guide",
    "GuideKey", "Key", "Map", "Skill", "SkillBg", "HeadBg", "TitleBg", "MainBg", "IconBg", "AvatarMask", "Progress", "Quality",
    "Settlement", "Ranking", "Challenge", "InvitationNotice", "Airdrop", "ShadowTrial", "Resonance", "DailyFreeGiftPack", "NPC", "Gold",
    "Switch", "UpGrade", "Vegetable", "Badge", "Loading", "PlayerPet", "Task", "Game", "Inscription", "Level", "Box", "Shadow", "Arena",
    "Wheel", "RankReward", "MonthyCard", "Direction", "Pagoda", "DeathEffect", "Empty", "Dispatch", "Party", "Tips", "Middle", "Role",
    "Dungeon"
  ].join("\n"),
  stateTerms: [
    "Normal", "Nml", "Hover", "Active", "Selected", "Select", "Sel", "Unselected", "UnSel", "Disabled", "Forbidden", "Lock", "Unlock",
    "Pressed", "Down", "Up", "Open", "Close", "Check", "Pick", "Ban", "Activate", "Default", "Focus", "On", "Off", "Red", "Blue",
    "Yellow", "Black", "White", "Left", "Right", "Top", "Bottom", "Small", "Big"
  ].join("\n"),
  filenameRules: [
    "Icon=Icon", "Bg=BG", "BG=BG", "bg=BG", "Btn=Button", "button=Button", "Line=Line", "Divider=Line", "Bar=Bar",
    "Progress=Progress", "ProgressBar=ProgressBar", "Light=Light", "Mask=Mask", "Frame=Frame", "Pattern=Pattern", "Tab=Tab",
    "Card=Card", "Container=Container", "Arrow=Arrow", "Sprite=Sprite", "Title=Title", "Txt=Text", "Text=Text", "Num=Number",
    "Sel=Selected", "Select=Selected", "Selected=Selected", "UnSel=Unselected", "Nml=Normal", "Normal=Normal", "Hover=Hover",
    "Active=Active", "Disabled=Disabled", "Forbidden=Forbidden", "PressedDwon=PressedDown", "PressedDown=PressedDown", "Check=Check",
    "Pick=Pick", "Ban=Ban", "Lock=Lock", "Unlock=Unlock", "Popup=Popup", "Toast=Toast", "Broadcast=Broadcast", "Recommend=Recommend",
    "Reward=Rewards", "Rewards=Rewards", "GloryReward=GloryRewards", "GloryRewards=GloryRewards", "Background=BG", "background=BG", "底=BG", "背景图=BG", "GuideKey=GuideKey", "TitleBg=Title_BG", "MainBg=Main_BG", "IconBg=Icon_BG", "Bp=BattlePass", "AMatch=ArenaMatch",
    "VX=VFX"
  ].join("\n"),
  contextDocs: [
    "命名结构固定为：T_UI_用户填写工程名_AI生成语义名。工程名只能来自用户填写的当前界面工程名，不能由 AI 从历史模块名自动生成。",
    "历史命名常见结构：T_UI_Img_工程名_语义_状态、T_UI_Icon_工程名_动作、T_UI_Bg_工程名_用途。Img/Icon/Bg/Btn/Line/Mask/Frame/Light/Tab 等词可作为内容语义参考。",
    "图片尺寸规律：64x64、128x128、256x256、512x512 多为 Icon/Badge；宽高比大于 3 且高度较小多为 Line/Bar/Progress；3440x1440、2048x1024、1024x512 等大图优先视为 BG/MainBg/PanelBg；方形大图常见 Mask、Frame、Badge、AvatarMask。",
    "状态词习惯：Normal/Nml 表示常态，Sel/Select/Selected 表示选中，UnSel 表示未选，Disabled/Forbidden 表示禁用，Check/Pick/Ban/Lock/Unlock 可作为状态或行为后缀。",
    "颜色/方向可作为末尾限定词保留：Red、Blue、Yellow、Black、White、Left、Right、Top、Bottom、Big、Small。"
  ].join("\n")
};

const ngrTemplateSchemeNames = ["NGR Icons命名规范", "NGR图集命名规范"];
const ngrTemplateSchemes = [
  normalizeLoadedRules({
    ...defaultRules,
    schemeName: "NGR Icons命名规范",
    basePrefix: "T_UI_Icon",
    projectName: "NGR",
    separator: "_",
    tags: "BG, Button, Hover, Normal, Icon, Item, Line, Bar, ProgressBar, Frame, Mask, Light, Pattern, Tab, Card, Selected, Forbidden, Lock, Unlock",
    pageTerms: "Home\nLogin\nProfile\nSettings",
    componentTerms: ngrTrainingKnowledge.componentTerms,
    stateTerms: ngrTrainingKnowledge.stateTerms,
    filenameRules: ngrTrainingKnowledge.filenameRules,
    contextDocs: [
      "该项目由驼峰命名规则首字母大写。该切图全部是 Icon，需要参考图片的中文进行英文翻译填写；如果英文翻译比较难，就使用拼音填写。",
      "可以根据切图自带的中文命名进行英文翻译，使用简洁的英文填入。",
      "命名结构固定为：T_UI_Icon_用户填写工程名_AI生成语义名。工程名只能来自当前界面工程名，不允许 AI 使用工程目录名作为语义词。",
      ngrTrainingKnowledge.contextDocs
    ].join("\n"),
  }),
  normalizeLoadedRules({
    ...defaultRules,
    schemeName: "NGR图集命名规范",
    basePrefix: "T_UI",
    projectName: "NGR",
    separator: "_",
    tags: "BG, Button, Hover, Normal, Icon, Item, Line, Bar, ProgressBar, Frame, Mask, Light, Pattern, Tab, Card, Selected, Forbidden, Lock, Unlock",
    pageTerms: "Home\nLogin\nProfile\nSettings",
    componentTerms: ngrTrainingKnowledge.componentTerms,
    stateTerms: ngrTrainingKnowledge.stateTerms,
    filenameRules: ngrTrainingKnowledge.filenameRules,
    contextDocs: [
      "该项目由驼峰命名规则首字母大写。命名应优先使用英文 Pascal Case 词组但要支持公认的缩写英文，并用下划线连接，例如 Home_Button_Normal。",
      "根据图片的相似性重点识别不同状态切图 Button、Normal、Hover、Active、Disabled 等按钮状态。",
      "可以根据切图自带的中文命名进行英文翻译，使用简洁的英文填入。",
      "命名结构固定为：T_UI_用户填写工程名_AI生成语义名。工程名只能来自当前界面工程名，不允许 AI 使用工程目录名作为语义词。",
      ngrTrainingKnowledge.contextDocs
    ].join("\n"),
  }),
];

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
  背景图: "BG",
  底: "BG",
  底板: "BG",
  底纹: "Pattern",
  按钮: "Button",
  图标: "Icon",
  导航: "Nav",
  横幅: "Banner",
  模块: "Item",
  页面: "Page",
  页: "Page",
  场景: "Scene",
  商店: "Shop",
  商城: "Shop",
  森林: "Forest",
  市场: "Market",
  营业: "Business",
  经营: "Business",
  记录: "Record",
  控件: "Control",
  遮罩: "Mask",
  覆盖层: "Overlay",
  覆盖: "Overlay",
  标题: "Title",
  游历: "Travel",
  外出游历: "Travel_Journal",
  日志: "Journal",
  手札: "Journal",
  札记: "Note",
  笔记: "Note",
  冒险: "Adventure",
  旅程: "Journey",
  白菊: "White_Chrysanthemum",
  菊花: "Chrysanthemum",
  花: "Flower",
  左上: "Top_Left",
  右上: "Top_Right",
  左下: "Bottom_Left",
  右下: "Bottom_Right",
  上: "Top",
  下: "Bottom",
  左: "Left",
  右: "Right",
  奖励: "Rewards",
  常态: "Normal",
  默认: "Normal",
  悬浮: "Hover",
  选中: "Active",
  点击: "Active",
  禁用: "Disabled",
  不可用: "Disabled",
};

let projects = loadProjects();
let activeProjectId = loadActiveProjectId(projects);
let schemes = getActiveProject().schemes;
let rules = normalizeLoadedRules({ ...defaultRules, ...getProjectActiveScheme(getActiveProject()) });
let aiSettings = loadAiSettings();
let translationSettings = loadTranslationSettings();
let assets = [];
let detectionProfiles = loadDetectionProfiles();
let activeDetectionProfileId = loadActiveDetectionProfileId(detectionProfiles);
let detectionAssets = [];
let selectedId = null;
let referenceFile = null;
let namingController = null;
let stopRequested = false;
let showProblemOnly = false;
let showDetectionProblemOnly = false;
let showDetectionWarningOnly = false;
let toastTimer = null;
let activeLexiconCategory = "状态";
let listDisplayMode = loadListDisplayMode();
let listSortMode = loadListSortMode();

const els = {
  backButton: document.querySelector("#backButton"),
  pageHint: document.querySelector("#pageHint"),
  views: {
    home: document.querySelector("#homeView"),
    rules: document.querySelector("#rulesView"),
    work: document.querySelector("#workView"),
    detect: document.querySelector("#detectView"),
    detectionSettings: document.querySelector("#detectionSettingsView"),
  },
  rulesEntry: document.querySelector("#rulesEntry"),
  workEntry: document.querySelector("#workEntry"),
  detectEntry: document.querySelector("#detectEntry"),
  projectSelect: document.querySelector("#projectSelect"),
  projectConfigName: document.querySelector("#projectConfigName"),
  projectConfigDescription: document.querySelector("#projectConfigDescription"),
  schemeSelect: document.querySelector("#schemeSelect"),
  workSchemeSelect: document.querySelector("#workSchemeSelect"),
  schemeName: document.querySelector("#schemeName"),
  basePrefix: document.querySelector("#basePrefix"),
  prefixPreset: document.querySelector("#prefixPreset"),
  projectName: document.querySelector("#projectName"),
  workProjectName: document.querySelector("#workProjectName"),
  separator: document.querySelector("#separator"),
  tags: document.querySelector("#tags"),
  pageTerms: document.querySelector("#pageTerms"),
  componentTerms: document.querySelector("#componentTerms"),
  stateTerms: document.querySelector("#stateTerms"),
  filenameRules: document.querySelector("#filenameRules"),
  contextDocs: document.querySelector("#contextDocs"),
  aiProvider: document.querySelector("#aiProvider"),
  aiApiFormat: document.querySelector("#aiApiFormat"),
  aiBaseUrl: document.querySelector("#aiBaseUrl"),
  openaiApiKey: document.querySelector("#openaiApiKey"),
  openaiModel: document.querySelector("#openaiModel"),
  aiProviderNote: document.querySelector("#aiProviderNote"),
  saveAiSettings: document.querySelector("#saveAiSettings"),
  useTempAiSettings: document.querySelector("#useTempAiSettings"),
  testAiSettings: document.querySelector("#testAiSettings"),
  exportAiSettings: document.querySelector("#exportAiSettings"),
  importAiSettings: document.querySelector("#importAiSettings"),
  exportSchemeTemplate: document.querySelector("#exportSchemeTemplate"),
  importSchemeTemplate: document.querySelector("#importSchemeTemplate"),
  prefixPreview: document.querySelector("#prefixPreview"),
  saveRules: document.querySelector("#saveRules"),
  saveAsScheme: document.querySelector("#saveAsScheme"),
  deleteScheme: document.querySelector("#deleteScheme"),
  newProject: document.querySelector("#newProject"),
  saveProject: document.querySelector("#saveProject"),
  deleteProject: document.querySelector("#deleteProject"),
  resetRules: document.querySelector("#resetRules"),
  activeRuleText: document.querySelector("#activeRuleText"),
  uploadDropZone: document.querySelector("#uploadDropZone"),
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
  listDisplayMode: document.querySelector("#listDisplayMode"),
  listSortMode: document.querySelector("#listSortMode"),
  applySuffix: document.querySelector("#applySuffix"),
  problemFilter: document.querySelector("#problemFilter"),
  removeSelected: document.querySelector("#removeSelected"),
  detectionProfileSelect: document.querySelector("#detectionProfileSelect"),
  detectionModeSelect: document.querySelector("#detectionModeSelect"),
  duplicateSensitivitySelect: document.querySelector("#duplicateSensitivitySelect"),
  detectionSettingsEntry: document.querySelector("#detectionSettingsEntry"),
  detectionSettingsProfileSelect: document.querySelector("#detectionSettingsProfileSelect"),
  detectionProfileName: document.querySelector("#detectionProfileName"),
  detectionProfileMode: document.querySelector("#detectionProfileMode"),
  duplicateSensitivityProfile: document.querySelector("#duplicateSensitivityProfile"),
  detectionMaxSide: document.querySelector("#detectionMaxSide"),
  detectionBgWidth: document.querySelector("#detectionBgWidth"),
  detectionBgHeight: document.querySelector("#detectionBgHeight"),
  detectionLargeThreshold: document.querySelector("#detectionLargeThreshold"),
  detectionLargeMultiple: document.querySelector("#detectionLargeMultiple"),
  detectionAtlasMultiple: document.querySelector("#detectionAtlasMultiple"),
  saveDetectionProfile: document.querySelector("#saveDetectionProfile"),
  newDetectionProfile: document.querySelector("#newDetectionProfile"),
  deleteDetectionProfile: document.querySelector("#deleteDetectionProfile"),
  backToDetection: document.querySelector("#backToDetection"),
  detectionDropZone: document.querySelector("#detectionDropZone"),
  detectionFolderInput: document.querySelector("#detectionFolderInput"),
  detectionSingleInput: document.querySelector("#detectionSingleInput"),
  detectionRulesToggle: document.querySelector("#detectionRulesToggle"),
  detectionRulesPanel: document.querySelector("#detectionRulesPanel"),
  detectionProblemFilter: document.querySelector("#detectionProblemFilter"),
  detectionWarningFilter: document.querySelector("#detectionWarningFilter"),
  clearDetectionAssets: document.querySelector("#clearDetectionAssets"),
  detectionCount: document.querySelector("#detectionCount"),
  detectionList: document.querySelector("#detectionList"),
  translatorPanel: document.querySelector("#translatorPanel"),
  translatorToggle: document.querySelector("#translatorToggle"),
  translatorClose: document.querySelector("#translatorClose"),
  translatorSettingsToggle: document.querySelector("#translatorSettingsToggle"),
  translatorSettings: document.querySelector("#translatorSettings"),
  translatorProvider: document.querySelector("#translatorProvider"),
  baiduTranslateAppId: document.querySelector("#baiduTranslateAppId"),
  baiduTranslateSecret: document.querySelector("#baiduTranslateSecret"),
  baiduTranslateEndpoint: document.querySelector("#baiduTranslateEndpoint"),
  saveTranslatorSettings: document.querySelector("#saveTranslatorSettings"),
  testTranslatorSettings: document.querySelector("#testTranslatorSettings"),
  translatorInput: document.querySelector("#translatorInput"),
  translatorToName: document.querySelector("#translatorToName"),
  translatorExplain: document.querySelector("#translatorExplain"),
  translatorOutput: document.querySelector("#translatorOutput"),
  toast: document.querySelector("#toast"),
};

init();

function init() {
  bindNavigation();
  bindRules();
  bindUploads();
  bindEditor();
  bindDetection();
  bindTranslator();
  protectEditableShortcuts();
  fillListDisplayMode();
  fillListSortMode();
  fillRulesForm();
  fillDetectionProfileForm();
  fillAiSettings();
  fillTranslationSettings();
  upsertScheme(rules, false);
  saveProjects();
  renderProjectSelect();
  renderSchemeSelect();
  renderDetectionProfileSelect();
  renderDetectionList();
  syncWorkProjectFields();
  updateRulePreview();
  updateActiveRuleText();
}

function protectEditableShortcuts(root = document) {
  root.querySelectorAll("input, textarea").forEach((field) => {
    if (field.dataset.shortcutProtected) return;
    field.dataset.shortcutProtected = "true";
    ["keydown", "keyup", "keypress", "copy", "cut", "paste"].forEach((eventName) => {
      field.addEventListener(eventName, (event) => event.stopPropagation());
    });
  });
}

function bindNavigation() {
  els.rulesEntry.addEventListener("click", () => showView("rules"));
  els.workEntry.addEventListener("click", () => showView("work"));
  els.detectEntry.addEventListener("click", () => showView("detect"));
  els.detectionSettingsEntry?.addEventListener("click", () => showView("detectionSettings"));
  els.backToDetection.addEventListener("click", () => showView("detect"));
  els.backButton.addEventListener("click", () => showView("home"));
}

function showView(name) {
  Object.entries(els.views).forEach(([key, node]) => node.classList.toggle("active", key === name));
  els.backButton.classList.toggle("hidden", name === "home");
  els.rulesEntry.classList.toggle("hidden", name === "detect" || name === "detectionSettings");
  const hints = {
    home: "批量整理 UI 切图名称，让文件名保持统一、清楚、可追踪。",
    rules: "配置全局命名前缀、分隔符与通用标签。工程名可在开始命名页按当前界面填写。",
    work: "填写当前界面工程名，上传切图后可在每张图片旁边直接改名。",
    detect: "上传切图文件夹，按项目组规则检测分辨率是否符合规范。",
    detectionSettings: "单独配置 UI 切图检测项目组和分辨率参数。",
  };
  els.pageHint.textContent = hints[name];
}

function bindRules() {
  [els.projectConfigName, els.projectConfigDescription, els.schemeName, els.basePrefix, els.projectName, els.separator, els.tags, els.pageTerms, els.componentTerms, els.stateTerms, els.filenameRules, els.contextDocs].forEach((input) => {
    input.addEventListener("input", () => {
      rules = collectRulesForm();
      if (input === els.projectName) els.workProjectName.value = rules.projectName;
      updateRulePreview();
      updateActiveRuleText();
      renderAssetList();
    });
  });

  els.projectSelect.addEventListener("change", () => switchProject(els.projectSelect.value));

  els.schemeSelect.addEventListener("change", () => {
    switchScheme(els.schemeSelect.value);
  });

  els.workSchemeSelect.addEventListener("change", () => {
    switchScheme(els.workSchemeSelect.value);
  });

  els.prefixPreset.addEventListener("change", () => {
    if (!els.prefixPreset.value) return;
    els.basePrefix.value = els.prefixPreset.value;
    rules = collectRulesForm();
    saveRules(rules);
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
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
    saveProjectMeta();
    fillRulesForm();
    renderProjectSelect();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("项目配置方案已保存");
  });

  els.saveAsScheme.addEventListener("click", () => {
    rules = collectRulesForm();
    saveRules(rules);
    upsertScheme(rules);
    saveProjectMeta();
    fillRulesForm();
    renderProjectSelect();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已保存配置方案：" + rules.schemeName);
  });

  els.deleteScheme.addEventListener("click", deleteCurrentScheme);
  els.newProject.addEventListener("click", createProject);
  els.saveProject.addEventListener("click", () => {
    saveProjectMeta();
    renderProjectSelect();
    showToast("项目已保存");
  });
  els.deleteProject.addEventListener("click", deleteCurrentProject);

  els.resetRules.addEventListener("click", () => {
    rules = { ...defaultRules };
    saveRules(rules);
    upsertScheme(rules);
    fillRulesForm();
    renderProjectSelect();
    renderSchemeSelect();
    updateRulePreview();
    updateActiveRuleText();
    renderAssetList();
    showToast("已恢复默认规则");
  });

  [els.aiProvider, els.aiApiFormat, els.aiBaseUrl, els.openaiApiKey, els.openaiModel, els.aiProviderNote].forEach((input) => {
    input.addEventListener("input", () => {
      aiSettings = collectAiSettings();
    });
  });

  els.aiProvider.addEventListener("change", () => {
    applyProviderPreset();
    aiSettings = collectAiSettings();
  });

  els.saveAiSettings.addEventListener("click", () => {
    aiSettings = collectAiSettings();
    saveAiSettings(aiSettings);
    showToast("AI 配置已保存");
  });

  els.useTempAiSettings.addEventListener("click", useTempAiSettings);

  els.testAiSettings.addEventListener("click", testAiSettings);

  els.exportAiSettings.addEventListener("click", exportAiSettings);
  els.importAiSettings.addEventListener("change", importAiSettings);

  els.exportSchemeTemplate.addEventListener("click", exportSchemeTemplate);
  els.importSchemeTemplate.addEventListener("change", importSchemeTemplate);
}

function switchScheme(schemeName) {
  const selected = schemes.find((scheme) => scheme.schemeName === schemeName);
  if (!selected) return;
  rules = normalizeLoadedRules({ ...defaultRules, ...selected });
  getActiveProject().activeSchemeName = rules.schemeName;
  saveProjects();
  saveRules(rules);
  fillRulesForm();
  renderProjectSelect();
  renderSchemeSelect();
  syncWorkProjectFields();
  updateRulePreview();
  updateActiveRuleText();
  renderAssetList();
  showToast("已切换配置方案");
}

function createProject() {
  const index = projects.length + 1;
  const project = {
    id: "project-" + Date.now(),
    name: "新项目 " + index,
    description: "新的项目命名配置",
    activeSchemeName: "默认配置方案",
    schemes: [
      normalizeLoadedRules({
        ...defaultRules,
        schemeName: "默认配置方案",
        projectName: "NewProject",
        contextDocs: "填写这个项目的页面结构、组件约定和命名偏好。AI 命名时会参考这里的内容。",
      }),
    ],
  };
  projects.push(project);
  activeProjectId = project.id;
  schemes = project.schemes;
  rules = normalizeLoadedRules({ ...defaultRules, ...schemes[0] });
  saveProjects();
  saveRules(rules);
  fillRulesForm();
  renderProjectSelect();
  renderSchemeSelect();
  syncWorkProjectFields();
  updateRulePreview();
  updateActiveRuleText();
  renderAssetList();
  showToast("已新建项目");
}

function switchProject(projectId) {
  const nextProject = projects.find((project) => project.id === projectId);
  if (!nextProject) return;
  activeProjectId = projectId;
  localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
  schemes = nextProject.schemes.length ? nextProject.schemes : [normalizeLoadedRules({ ...defaultRules })];
  nextProject.schemes = schemes;
  rules = normalizeLoadedRules({ ...defaultRules, ...getProjectActiveScheme(nextProject) });
  saveProjects();
  saveRules(rules);
  fillRulesForm();
  renderProjectSelect();
  renderSchemeSelect();
  syncWorkProjectFields();
  updateRulePreview();
  updateActiveRuleText();
  renderAssetList();
  showToast("已切换项目");
}

function saveProjectMeta() {
  const project = getActiveProject();
  project.name = els.projectConfigName.value.trim() || project.name || "未命名项目";
  project.description = els.projectConfigDescription.value.trim();
  project.activeSchemeName = rules.schemeName;
  saveProjects();
}

function deleteCurrentScheme() {
  if (schemes.length <= 1) {
    showToast("至少保留一个配置方案");
    return;
  }
  const target = rules.schemeName;
  schemes = schemes.filter((scheme) => scheme.schemeName !== target);
  const project = getActiveProject();
  project.schemes = schemes;
  rules = normalizeLoadedRules({ ...defaultRules, ...schemes[0] });
  project.activeSchemeName = rules.schemeName;
  saveProjects();
  saveRules(rules);
  fillRulesForm();
  renderProjectSelect();
  renderSchemeSelect();
  syncWorkProjectFields();
  updateRulePreview();
  updateActiveRuleText();
  renderAssetList();
  showToast("已删除配置方案");
}

function deleteCurrentProject() {
  if (projects.length <= 1) {
    showToast("至少保留一个项目");
    return;
  }
  projects = projects.filter((project) => project.id !== activeProjectId);
  activeProjectId = projects[0].id;
  schemes = getActiveProject().schemes;
  rules = normalizeLoadedRules({ ...defaultRules, ...schemes[0] });
  saveProjects();
  localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
  saveRules(rules);
  fillRulesForm();
  renderProjectSelect();
  renderSchemeSelect();
  syncWorkProjectFields();
  updateRulePreview();
  updateActiveRuleText();
  renderAssetList();
  showToast("已删除项目");
}

function bindUploads() {
  els.folderInput.addEventListener("change", (event) => addFiles([...event.target.files]));
  els.singleInput.addEventListener("change", (event) => addFiles([...event.target.files]));
  ["dragenter", "dragover"].forEach((eventName) => {
    els.uploadDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.uploadDropZone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    els.uploadDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (eventName === "drop") return;
      els.uploadDropZone.classList.remove("drag-over");
    });
  });
  els.uploadDropZone.addEventListener("drop", async (event) => {
    els.uploadDropZone.classList.remove("drag-over");
    const files = await collectDroppedFiles(event.dataTransfer);
    addFiles(files);
  });
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

function bindDetection() {
  els.detectionFolderInput.addEventListener("change", (event) => addDetectionFiles([...event.target.files]));
  els.detectionSingleInput.addEventListener("change", (event) => addDetectionFiles([...event.target.files]));
  ["dragenter", "dragover"].forEach((eventName) => {
    els.detectionDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.detectionDropZone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    els.detectionDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (eventName === "drop") return;
      els.detectionDropZone.classList.remove("drag-over");
    });
  });
  els.detectionDropZone.addEventListener("drop", async (event) => {
    els.detectionDropZone.classList.remove("drag-over");
    const files = await collectDroppedFiles(event.dataTransfer);
    addDetectionFiles(files);
  });
  els.detectionProfileSelect.addEventListener("change", () => {
    switchDetectionProfile(els.detectionProfileSelect.value);
  });
  els.detectionModeSelect.addEventListener("change", () => {
    updateActiveDetectionProfile({ ...getActiveDetectionProfile(), mode: els.detectionModeSelect.value }, true);
    fillDetectionProfileForm();
    revalidateDetectionAssets();
    showToast("检测模式已切换");
  });
  els.duplicateSensitivitySelect.addEventListener("change", () => {
    updateActiveDetectionProfile({ ...getActiveDetectionProfile(), duplicateSensitivity: els.duplicateSensitivitySelect.value }, true);
    fillDetectionProfileForm();
    revalidateDetectionAssets();
    showToast("重复检测灵敏度已切换");
  });
  els.detectionSettingsProfileSelect.addEventListener("change", () => {
    switchDetectionProfile(els.detectionSettingsProfileSelect.value);
  });
  [els.detectionProfileName, els.detectionProfileMode, els.duplicateSensitivityProfile, els.detectionMaxSide, els.detectionBgWidth, els.detectionBgHeight, els.detectionLargeThreshold, els.detectionLargeMultiple, els.detectionAtlasMultiple].forEach((input) => {
    input.addEventListener("input", () => {
      updateActiveDetectionProfile(collectDetectionProfileForm(), false);
      revalidateDetectionAssets();
    });
  });
  els.saveDetectionProfile.addEventListener("click", () => {
    updateActiveDetectionProfile(collectDetectionProfileForm(), true);
    showToast("检测参数已保存");
  });
  els.newDetectionProfile.addEventListener("click", createDetectionProfile);
  els.deleteDetectionProfile.addEventListener("click", deleteDetectionProfile);
  els.detectionProblemFilter.addEventListener("click", toggleDetectionProblemFilter);
  els.detectionWarningFilter.addEventListener("click", toggleDetectionWarningFilter);
  els.detectionRulesToggle.addEventListener("click", () => {
    const isHidden = els.detectionRulesPanel.classList.toggle("hidden");
    els.detectionRulesToggle.textContent = isHidden ? "查看检测规范" : "收起检测规范";
    els.detectionRulesToggle.setAttribute("aria-expanded", String(!isHidden));
  });
  els.clearDetectionAssets.addEventListener("click", () => {
    detectionAssets = [];
    renderDetectionList();
    showToast("检测列表已清空");
  });
}

function bindTranslator() {
  els.translatorToggle.addEventListener("click", () => {
    els.translatorPanel.classList.toggle("collapsed");
    if (!els.translatorPanel.classList.contains("collapsed")) els.translatorInput.focus();
  });
  els.translatorClose.addEventListener("click", () => {
    els.translatorPanel.classList.add("collapsed");
  });
  els.translatorSettingsToggle.addEventListener("click", () => {
    els.translatorSettings.classList.toggle("hidden");
  });
  els.saveTranslatorSettings.addEventListener("click", () => {
    translationSettings = collectTranslationSettings();
    saveTranslationSettings(translationSettings);
    showToast("翻译 API 设置已保存");
  });
  els.testTranslatorSettings.addEventListener("click", testTranslationSettings);
  els.translatorToName.addEventListener("click", async () => {
    const source = normalizeSourceName(els.translatorInput.value);
    if (!source) {
      els.translatorOutput.textContent = "请输入中文文件名、英文命名或单词";
      return;
    }
    els.translatorOutput.textContent = "翻译中...";
    const translated = await translateToNamingWord(source);
    els.translatorOutput.textContent = translated ? "命名词：" + translated + "\n中文含义：" + await explainNameWithTranslation(translated) : "没有匹配到可用命名词";
  });
  els.translatorExplain.addEventListener("click", async () => {
    const source = cleanNamingName(els.translatorInput.value);
    els.translatorOutput.textContent = source ? "翻译中..." : "请输入需要解释的英文命名";
    if (source) els.translatorOutput.textContent = await explainNameWithTranslation(source);
  });
}

async function translateToNamingWord(source) {
  const localName = cleanNamingName(translateFilename(source, parseKnowledge()));
  if (translationSettings.provider !== "baidu") return localName;
  try {
    const apiText = await translateTextByApi(source, "zh", "en");
    const apiName = cleanNamingName(String(apiText || "").replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[^A-Za-z0-9_]+/g, "_"));
    return apiName || localName;
  } catch (error) {
    return localName || "";
  }
}

async function explainNameWithTranslation(name) {
  const localMeaning = explainEnglishName(name);
  if (translationSettings.provider !== "baidu") return localMeaning;
  try {
    const readable = cleanNamingName(name).replace(/_/g, " ");
    const apiText = await translateTextByApi(readable, "en", "zh");
    return apiText || localMeaning;
  } catch (error) {
    return localMeaning + "\n提示：百度翻译 API 调用失败，已使用本地词库解释。";
  }
}

async function testTranslationSettings() {
  translationSettings = collectTranslationSettings();
  saveTranslationSettings(translationSettings);
  els.translatorOutput.textContent = "正在测试翻译 API...";
  if (translationSettings.provider !== "baidu") {
    els.translatorOutput.textContent = "当前使用本地词库，不需要测试 API。";
    showToast("当前使用本地词库");
    return;
  }
  try {
    const result = await translateTextByApi("测试", "zh", "en");
    els.translatorOutput.textContent = "测试成功：测试 -> " + result;
    showToast("百度翻译 API 测试成功");
  } catch (error) {
    els.translatorOutput.textContent = "测试失败：" + error.message;
    showToast("百度翻译 API 测试失败");
  }
}

function switchDetectionProfile(profileId) {
  activeDetectionProfileId = profileId;
  localStorage.setItem(ACTIVE_DETECTION_PROFILE_KEY, activeDetectionProfileId);
  renderDetectionProfileSelect();
  fillDetectionProfileForm();
  revalidateDetectionAssets();
}

async function collectDroppedFiles(dataTransfer) {
  const items = [...(dataTransfer.items || [])];
  const fallbackFiles = [...(dataTransfer.files || [])];
  if (!items.length) return fallbackFiles;
  const files = (await Promise.all(items.map(readDroppedItem))).flat().filter(Boolean);
  return files.length ? files : fallbackFiles;
}

async function readDroppedItem(item) {
  if (item.getAsFileSystemHandle) {
    const handle = await item.getAsFileSystemHandle().catch(() => null);
    if (handle) return readFileSystemHandleFiles(handle);
  }
  const entry = item.webkitGetAsEntry?.();
  if (entry) return readEntryFiles(entry);
  const file = item.getAsFile?.();
  return file ? [file] : [];
}

async function readFileSystemHandleFiles(handle) {
  if (handle.kind === "file") {
    const file = await handle.getFile().catch(() => null);
    return file ? [file] : [];
  }
  if (handle.kind !== "directory") return [];
  const files = [];
  for await (const child of handle.values()) {
    files.push(...await readFileSystemHandleFiles(child));
  }
  return files;
}

function readEntryFiles(entry) {
  if (entry.isFile) {
    return new Promise((resolve) => entry.file((file) => resolve([file]), () => resolve([])));
  }
  if (!entry.isDirectory) return Promise.resolve([]);
  const reader = entry.createReader();
  const entries = [];
  return new Promise((resolve) => {
    const readBatch = () => {
      reader.readEntries(async (batch) => {
        if (!batch.length) {
          const nestedFiles = await Promise.all(entries.map(readEntryFiles));
          resolve(nestedFiles.flat());
          return;
        }
        entries.push(...batch);
        readBatch();
      }, () => resolve([]));
    };
    readBatch();
  });
}

function bindEditor() {
  els.runNaming.addEventListener("click", runNaming);
  els.stopNaming.addEventListener("click", stopNaming);
  els.applySuffix.addEventListener("click", applyBatchSuffix);
  els.problemFilter.addEventListener("click", toggleProblemFilter);
  els.removeSelected.addEventListener("click", removeSelectedAssets);
  els.exportFiles.addEventListener("click", exportRenamedFiles);
  els.listDisplayMode.addEventListener("change", () => {
    listDisplayMode = els.listDisplayMode.value === "compact" ? "compact" : "full";
    localStorage.setItem(LIST_DISPLAY_MODE_KEY, listDisplayMode);
    renderAssetList();
  });
  els.listSortMode.addEventListener("change", () => {
    listSortMode = normalizeListSortMode(els.listSortMode.value);
    localStorage.setItem(LIST_SORT_MODE_KEY, listSortMode);
    renderAssetList();
  });
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
    return;
  }
  if (provider === "kimi") {
    els.aiBaseUrl.value = "https://api.moonshot.cn/v1";
    els.aiApiFormat.value = "chat";
    els.openaiModel.value = "moonshot-v1-8k-vision-preview";
    els.aiProviderNote.value = "Kimi / Moonshot 视觉模型";
  }
}

function useTempAiSettings() {
  const localConfig = normalizeAiSettings(readLocalAiConfig());
  if (!localConfig.apiKey) {
    showToast("未找到临时测试 API，请先配置 local-config.js");
    return;
  }
  aiSettings = localConfig;
  fillAiSettings();
  saveAiSettings(aiSettings);
  showToast("已使用临时测试 API 配置");
}

async function testAiSettings() {
  aiSettings = collectAiSettings();
  saveAiSettings(aiSettings);
  if (!aiSettings.apiKey) {
    showToast("请先填写 API Key");
    return;
  }
  els.testAiSettings.disabled = true;
  els.testAiSettings.textContent = "测试中";
  try {
    const endpoint = buildAiEndpoint(aiSettings.apiFormat || "responses");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + aiSettings.apiKey,
      },
      body: JSON.stringify(buildAiTestPayload()),
    });
    showToast(response.ok ? "API 测试通过，配置已保存" : "API 测试失败，请检查地址、Key 和模型");
  } catch {
    showToast("API 测试失败，请检查网络或接口地址");
  } finally {
    els.testAiSettings.disabled = false;
    els.testAiSettings.textContent = "测试 API";
  }
}

function exportAiSettings() {
  aiSettings = collectAiSettings();
  saveAiSettings(aiSettings);
  const payload = {
    type: "NGR_AI_API_CONFIG",
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: aiSettings,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ngr-ai-api-config.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("API 配置已导出，请妥善保管文件中的 API Key");
}

async function importAiSettings(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const importedSettings = payload.settings || payload;
    aiSettings = normalizeAiSettings(importedSettings);
    saveAiSettings(aiSettings);
    fillAiSettings();
    showToast("API 配置已导入并保存");
  } catch {
    showToast("API 配置导入失败，请确认文件是 JSON 配置");
  }
}

function buildAiTestPayload() {
  const prompt = "请只返回 JSON：{\"names\":[\"Test_Name\"]}";
  if ((aiSettings.apiFormat || "responses") === "chat") {
    return {
      model: aiSettings.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };
  }
  return {
    model: aiSettings.model,
    input: prompt,
  };
}

function buildAiPrompt(asset, localRecommendations) {
  return [
    "你是 UI 切图命名助手。请根据切图图片、参考效果图、原始文件名和团队命名知识库，生成 2 到 5 个英文语义名称。",
    "只返回 JSON，格式为：{\"names\":[\"Login_Button_Hover\",\"Home_BG\"]}。",
    "不要包含固定前缀、工程名、文件扩展名。名称只允许英文字母、数字和下划线，使用 Pascal/Title 英文词组并以下划线连接。",
    "命名单词禁止出现 Module 或 Modules；如果需要表达通用元素，请使用 Item、Panel、Card、Icon、BG 等更具体词。",
    "命名单词禁止出现 Background；凡是背景、底图、底、background、Background，都必须使用短词 BG。",
    "原始文件名：" + asset.originalBase + asset.extension,
    "当前前缀：" + buildAssetPrefix(asset),
    "本地候选：" + localRecommendations.join(", "),
    "页面词库：" + parseList(rules.pageTerms).join(", "),
    "组件词库：" + parseList(rules.componentTerms).join(", "),
    "状态词库：" + parseList(rules.stateTerms).join(", "),
    "文件名匹配规则：" + parseFilenameRules(rules.filenameRules).map((rule) => rule.keyword + "=" + rule.value).join(", "),
    "项目上下文文档：" + (rules.contextDocs || "无"),
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
    .map((name) => formatNamingName(name))
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

function toggleProblemFilter() {
  showProblemOnly = !showProblemOnly;
  els.problemFilter.textContent = showProblemOnly ? "显示全部图片" : "只看问题图片";
  els.problemFilter.setAttribute("aria-pressed", String(showProblemOnly));
  renderAssetList();
}

function toggleDetectionProblemFilter() {
  showDetectionProblemOnly = !showDetectionProblemOnly;
  if (showDetectionProblemOnly) showDetectionWarningOnly = false;
  syncDetectionFilterButtons();
  renderDetectionList();
}

function toggleDetectionWarningFilter() {
  showDetectionWarningOnly = !showDetectionWarningOnly;
  if (showDetectionWarningOnly) showDetectionProblemOnly = false;
  syncDetectionFilterButtons();
  renderDetectionList();
}

function syncDetectionFilterButtons() {
  els.detectionProblemFilter.textContent = showDetectionProblemOnly ? "显示全部图片" : "只看问题图片";
  els.detectionProblemFilter.setAttribute("aria-pressed", String(showDetectionProblemOnly));
  els.detectionWarningFilter.textContent = showDetectionWarningOnly ? "显示全部图片" : "只看警告图片";
  els.detectionWarningFilter.setAttribute("aria-pressed", String(showDetectionWarningOnly));
}

async function addFiles(files) {
  const imageFiles = files.filter(isSupportedImage);
  if (!imageFiles.length) {
    showToast("未发现可处理的图片文件");
    return;
  }

  const additions = await Promise.all(imageFiles.map(fileToAsset));
  const seen = new Set(assets.map((asset) => asset.key));
  let loadedCount = 0;
  let loadedIssueCount = 0;
  additions.forEach((asset) => {
    if (!seen.has(asset.key)) {
      assets.push(asset);
      seen.add(asset.key);
      loadedCount += 1;
      if (asset.dimensionIssue) loadedIssueCount += 1;
    }
  });
  if (!selectedId && assets.length) selectedId = assets[0].id;
  renderAssetList();
  if (loadedIssueCount) {
    showToast("已载入 " + loadedCount + " 张，其中 " + loadedIssueCount + " 张分辨率有问题");
  } else {
    showToast("已载入 " + loadedCount + " 张切图");
  }
}

async function addDetectionFiles(files) {
  const imageFiles = files.filter(isSupportedImage);
  if (!imageFiles.length) {
    showToast("未发现可检测的图片文件");
    return;
  }

  const additions = await Promise.all(imageFiles.map(fileToDetectionAsset));
  const seen = new Set(detectionAssets.map((asset) => asset.key));
  let loadedCount = 0;
  let issueCount = 0;
  additions.forEach((asset) => {
    if (seen.has(asset.key)) return;
    detectionAssets.push(asset);
    seen.add(asset.key);
    loadedCount += 1;
    if (asset.hasIssue) issueCount += 1;
  });
  updateSimilarResourceWarnings();
  renderDetectionList();
  showToast(issueCount ? "已检测 " + loadedCount + " 张，其中 " + issueCount + " 张有问题" : "已检测 " + loadedCount + " 张，全部通过");
}

function isSupportedImage(file) {
  return IMAGE_TYPES.includes(file.type) || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
}

async function fileToAsset(file) {
  const url = URL.createObjectURL(file);
  const dimensions = await readImageDimensions(url).catch(() => ({ width: 0, height: 0 }));
  const validation = validateUploadDimensions(dimensions);
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
    sizeCategory: validation.category,
    sizeCategoryLabel: validation.label,
    dimensionIssue: Boolean(validation.problem),
    dimensionWarning: Boolean(validation.warning),
    dimensionIssueMessage: validation.reason || "",
    checked: false,
    recommendations: [],
    finalBaseName: "",
    customPrefix: "",
    lexiconOpen: false,
    namingStatus: "idle",
    statusMessage: "",
  };
}

async function fileToDetectionAsset(file) {
  const url = URL.createObjectURL(file);
  const dimensions = await readImageDimensions(url).catch(() => ({ width: 0, height: 0 }));
  const result = validateDetectionDimensions(dimensions, getActiveDetectionProfile());
  const formatMessages = validateDetectionFormat(file);
  if (formatMessages.length) {
    result.messages = [...(result.messages || []), ...formatMessages];
    result.hasIssue = true;
  }
  const fingerprint = await imageFileToFingerprint(file).catch(() => null);
  const id = crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random();
  const key = (file.webkitRelativePath || file.name) + "-" + file.size + "-" + file.lastModified;
  return {
    id,
    key,
    file,
    url,
    name: file.webkitRelativePath || file.name,
    dimensions,
    fingerprint,
    ...result,
  };
}

function validateDetectionFormat(file) {
  return /\.png$/i.test(file.name) ? [] : ["注意导出切图格式，NGR只允许png格式，不允许其他格式"];
}

function validateDetectionDimensions(dimensions, profile) {
  const { width, height } = dimensions || {};
  if (!width || !height) {
    return { hasIssue: true, label: "无法读取", messages: ["无法读取图片分辨率"] };
  }
  const config = normalizeDetectionProfile(profile);
  const maxSide = Math.max(width, height);
  const messages = [];
  const warnings = [];
  if (config.mode === "planner") return validatePlannerDetectionDimensions(width, height);
  if (config.mode === "icon") return validateIconDetectionDimensions(width, height);
  const isBackground = width === config.backgroundWidth && height === config.backgroundHeight;
  let label = isBackground ? "背景图" : maxSide > config.largeThreshold ? "大图" : "图集";

  if (width % 2 !== 0 || height % 2 !== 0) {
    messages.push("分辨率不是双数，不允许单数");
  }
  if (maxSide === 2048 && !isBackground) {
    warnings.push("该分辨率允许上传，但是不推荐使用，推荐切2张分辨率1024拼接");
  } else if (maxSide > config.maxSide && !isBackground) {
    messages.push("分辨率单边不能超过" + config.maxSide);
  }
  if (isBackground) {
    label = "背景图";
  } else if (maxSide > config.largeThreshold) {
    label = "大图";
    if (width % config.largeMultiple !== 0 || height % config.largeMultiple !== 0) {
      messages.push("单边超过" + config.largeThreshold + "的大图需要是" + config.largeMultiple + "的倍数");
    }
  } else if (width % config.atlasMultiple !== 0 || height % config.atlasMultiple !== 0) {
    messages.push("分辨率" + config.largeThreshold + "px以下的图片只要不是单数就行");
  }

  return {
    hasIssue: messages.length > 0,
    hasWarning: warnings.length > 0,
    label,
    warnings,
    messages,
  };
}

function validatePlannerDetectionDimensions(width, height) {
  const messages = [];
  const warnings = [];
  if (width % 2 !== 0 || height % 2 !== 0) messages.push("分辨率不是双数，不允许单数");
  if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) messages.push("策划配置切图规范：宽高都需要是2的幂次");
  return {
    hasIssue: messages.length > 0,
    hasWarning: warnings.length > 0,
    label: "策划配置",
    messages,
    warnings,
  };
}

function validateIconDetectionDimensions(width, height) {
  const allowedSizes = [32, 64, 128, 256, 512, 1024];
  const messages = [];
  if (width !== height) messages.push("Icon尺寸只允许正方形");
  if (!allowedSizes.includes(width) || !allowedSizes.includes(height)) messages.push("Icon尺寸只允许32x32、64x64、128x128、256x256、512x512、1024x1024");
  return {
    hasIssue: messages.length > 0,
    hasWarning: false,
    label: "Icon",
    messages,
    warnings: [],
  };
}

function validateUploadDimensions(dimensions) {
  const { width, height } = dimensions || {};
  if (!isNgrProject(getActiveProject())) return { valid: true, category: "", label: "" };
  if (!width || !height) return { valid: true, category: "unknown", label: "未知规格" };
  const isBackgroundSize = width === 3440 && height === 1440;
  const maxDimension = Math.max(width, height);
  if (width % 2 !== 0 || height % 2 !== 0) {
    return { valid: true, problem: true, category: "invalid", label: "问题图片", reason: "分辨率宽高不能是单数" };
  }
  if (maxDimension > 1024 && !isBackgroundSize) {
    if (maxDimension === 2048) return { valid: true, warning: true, category: "large", label: "大图", reason: "该分辨率允许上传，但是不推荐使用，推荐切2张分辨率1024拼接" };
    return { valid: true, problem: true, category: "invalid", label: "问题图片", reason: "除 3440x1440 背景图外，1024 以上分辨率有问题" };
  }
  if (maxDimension >= 512) {
    if (width % 4 !== 0 || height % 4 !== 0) {
      return { valid: true, problem: true, category: "invalid", label: "问题图片", reason: "512 以上大图宽高必须是 4 的倍数" };
    }
    return { valid: true, category: "large", label: "大图" };
  }
  if (width % 2 !== 0 || height % 2 !== 0) {
    return { valid: true, problem: true, category: "invalid", label: "问题图片", reason: "512 以下图集宽高必须是 2 的倍数" };
  }
  return { valid: true, category: "atlas", label: "图集" };
}

function readImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

async function imageFileToFingerprint(file) {
  if (!isRasterImage(file)) return null;
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const size = 12;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, size, size);
    const data = context.getImageData(0, 0, size, size).data;
    const values = [];
    for (let index = 0; index < data.length; index += 4) {
      values.push(Math.round((data[index] + data[index + 1] + data[index + 2]) / 3));
    }
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return values.map((value) => (value >= average ? "1" : "0")).join("");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function updateSimilarResourceWarnings() {
  const duplicateConfig = getDuplicateSensitivityConfig(getActiveDetectionProfile().duplicateSensitivity);
  detectionAssets.forEach((asset) => {
    asset.similarNames = [];
  });
  if (duplicateConfig.disabled) {
    detectionAssets.forEach((asset) => {
      const baseWarnings = (asset.warnings || []).filter((message) => !message.startsWith("疑似重复资源"));
      asset.warnings = baseWarnings;
      asset.hasWarning = Boolean(asset.warnings.length);
    });
    return;
  }
  for (let index = 0; index < detectionAssets.length; index += 1) {
    const current = detectionAssets[index];
    if (!current.fingerprint) continue;
    for (let nextIndex = index + 1; nextIndex < detectionAssets.length; nextIndex += 1) {
      const next = detectionAssets[nextIndex];
      if (!next.fingerprint) continue;
      if (!shouldCompareDuplicateAssets(current, next, duplicateConfig)) continue;
      const similarity = getFingerprintSimilarity(current.fingerprint, next.fingerprint);
      if (similarity >= duplicateConfig.threshold) {
        current.similarNames.push(next.name);
        next.similarNames.push(current.name);
      }
    }
  }
  detectionAssets.forEach((asset) => {
    const baseWarnings = (asset.warnings || []).filter((message) => !message.startsWith("疑似重复资源"));
    const similarWarnings = (asset.similarNames || []).slice(0, 3).map((name) => "疑似重复资源：" + name);
    asset.warnings = [...baseWarnings, ...similarWarnings];
    asset.hasWarning = Boolean(asset.warnings.length);
  });
}

function getDuplicateSensitivityConfig(level) {
  const configs = {
    low: { threshold: 0.99, dimensionTolerance: 0, minSide: 48, disabled: false },
    medium: { threshold: 0.965, dimensionTolerance: 0.06, minSide: 32, disabled: false },
    high: { threshold: 0.92, dimensionTolerance: 0.16, minSide: 0, disabled: false },
  };
  return configs[level] || configs.low;
}

function shouldCompareDuplicateAssets(left, right, config) {
  const leftWidth = left.dimensions?.width || 0;
  const leftHeight = left.dimensions?.height || 0;
  const rightWidth = right.dimensions?.width || 0;
  const rightHeight = right.dimensions?.height || 0;
  if (!leftWidth || !leftHeight || !rightWidth || !rightHeight) return false;
  if (Math.min(leftWidth, leftHeight, rightWidth, rightHeight) < config.minSide) return false;
  const widthTolerance = Math.abs(leftWidth - rightWidth) / Math.max(leftWidth, rightWidth);
  const heightTolerance = Math.abs(leftHeight - rightHeight) / Math.max(leftHeight, rightHeight);
  return widthTolerance <= config.dimensionTolerance && heightTolerance <= config.dimensionTolerance;
}

function getFingerprintSimilarity(left, right) {
  const length = Math.min(left.length, right.length);
  if (!length) return 0;
  let same = 0;
  for (let index = 0; index < length; index += 1) {
    if (left[index] === right[index]) same += 1;
  }
  return same / length;
}

function isPowerOfTwo(value) {
  return Number.isInteger(value) && value > 0 && (value & (value - 1)) === 0;
}

function md5(value) {
  const rotate = (x, c) => (x << c) | (x >>> (32 - c));
  const add = (x, y) => (((x >>> 0) + (y >>> 0)) & 0xffffffff) >>> 0;
  const cmn = (q, a, b, x, s, t) => add(rotate(add(add(a, q), add(x, t)), s), b);
  const ff = (a, b, c, d, x, s, t) => cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a, b, c, d, x, s, t) => cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a, b, c, d, x, s, t) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a, b, c, d, x, s, t) => cmn(c ^ (b | ~d), a, b, x, s, t);
  const text = unescape(encodeURIComponent(String(value || "")));
  const words = [];
  for (let index = 0; index < text.length; index += 1) {
    words[index >> 2] = (words[index >> 2] || 0) | (text.charCodeAt(index) << ((index % 4) * 8));
  }
  words[text.length >> 2] = (words[text.length >> 2] || 0) | (0x80 << ((text.length % 4) * 8));
  words[(((text.length + 8) >> 6) + 1) * 16 - 2] = text.length * 8;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  for (let index = 0; index < words.length; index += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;
    a = ff(a, b, c, d, words[index], 7, -680876936);
    d = ff(d, a, b, c, words[index + 1], 12, -389564586);
    c = ff(c, d, a, b, words[index + 2], 17, 606105819);
    b = ff(b, c, d, a, words[index + 3], 22, -1044525330);
    a = ff(a, b, c, d, words[index + 4], 7, -176418897);
    d = ff(d, a, b, c, words[index + 5], 12, 1200080426);
    c = ff(c, d, a, b, words[index + 6], 17, -1473231341);
    b = ff(b, c, d, a, words[index + 7], 22, -45705983);
    a = ff(a, b, c, d, words[index + 8], 7, 1770035416);
    d = ff(d, a, b, c, words[index + 9], 12, -1958414417);
    c = ff(c, d, a, b, words[index + 10], 17, -42063);
    b = ff(b, c, d, a, words[index + 11], 22, -1990404162);
    a = ff(a, b, c, d, words[index + 12], 7, 1804603682);
    d = ff(d, a, b, c, words[index + 13], 12, -40341101);
    c = ff(c, d, a, b, words[index + 14], 17, -1502002290);
    b = ff(b, c, d, a, words[index + 15], 22, 1236535329);
    a = gg(a, b, c, d, words[index + 1], 5, -165796510);
    d = gg(d, a, b, c, words[index + 6], 9, -1069501632);
    c = gg(c, d, a, b, words[index + 11], 14, 643717713);
    b = gg(b, c, d, a, words[index], 20, -373897302);
    a = gg(a, b, c, d, words[index + 5], 5, -701558691);
    d = gg(d, a, b, c, words[index + 10], 9, 38016083);
    c = gg(c, d, a, b, words[index + 15], 14, -660478335);
    b = gg(b, c, d, a, words[index + 4], 20, -405537848);
    a = gg(a, b, c, d, words[index + 9], 5, 568446438);
    d = gg(d, a, b, c, words[index + 14], 9, -1019803690);
    c = gg(c, d, a, b, words[index + 3], 14, -187363961);
    b = gg(b, c, d, a, words[index + 8], 20, 1163531501);
    a = gg(a, b, c, d, words[index + 13], 5, -1444681467);
    d = gg(d, a, b, c, words[index + 2], 9, -51403784);
    c = gg(c, d, a, b, words[index + 7], 14, 1735328473);
    b = gg(b, c, d, a, words[index + 12], 20, -1926607734);
    a = hh(a, b, c, d, words[index + 5], 4, -378558);
    d = hh(d, a, b, c, words[index + 8], 11, -2022574463);
    c = hh(c, d, a, b, words[index + 11], 16, 1839030562);
    b = hh(b, c, d, a, words[index + 14], 23, -35309556);
    a = hh(a, b, c, d, words[index + 1], 4, -1530992060);
    d = hh(d, a, b, c, words[index + 4], 11, 1272893353);
    c = hh(c, d, a, b, words[index + 7], 16, -155497632);
    b = hh(b, c, d, a, words[index + 10], 23, -1094730640);
    a = hh(a, b, c, d, words[index + 13], 4, 681279174);
    d = hh(d, a, b, c, words[index], 11, -358537222);
    c = hh(c, d, a, b, words[index + 3], 16, -722521979);
    b = hh(b, c, d, a, words[index + 6], 23, 76029189);
    a = hh(a, b, c, d, words[index + 9], 4, -640364487);
    d = hh(d, a, b, c, words[index + 12], 11, -421815835);
    c = hh(c, d, a, b, words[index + 15], 16, 530742520);
    b = hh(b, c, d, a, words[index + 2], 23, -995338651);
    a = ii(a, b, c, d, words[index], 6, -198630844);
    d = ii(d, a, b, c, words[index + 7], 10, 1126891415);
    c = ii(c, d, a, b, words[index + 14], 15, -1416354905);
    b = ii(b, c, d, a, words[index + 5], 21, -57434055);
    a = ii(a, b, c, d, words[index + 12], 6, 1700485571);
    d = ii(d, a, b, c, words[index + 3], 10, -1894986606);
    c = ii(c, d, a, b, words[index + 10], 15, -1051523);
    b = ii(b, c, d, a, words[index + 1], 21, -2054922799);
    a = ii(a, b, c, d, words[index + 8], 6, 1873313359);
    d = ii(d, a, b, c, words[index + 15], 10, -30611744);
    c = ii(c, d, a, b, words[index + 6], 15, -1560198380);
    b = ii(b, c, d, a, words[index + 13], 21, 1309151649);
    a = ii(a, b, c, d, words[index + 4], 6, -145523070);
    d = ii(d, a, b, c, words[index + 11], 10, -1120210379);
    c = ii(c, d, a, b, words[index + 2], 15, 718787259);
    b = ii(b, c, d, a, words[index + 9], 21, -343485551);
    a = add(a, oldA);
    b = add(b, oldB);
    c = add(c, oldC);
    d = add(d, oldD);
  }
  return [a, b, c, d].map((word) => [0, 8, 16, 24].map((shift) => ("0" + ((word >>> shift) & 255).toString(16)).slice(-2)).join("")).join("");
}

function renderAssetList() {
  const problemCount = assets.filter((asset) => asset.dimensionIssue).length;
  els.fileCount.textContent = assets.length + " 张" + (problemCount ? " / " + problemCount + " 张问题" : "");
  if (!assets.length) {
    els.assetList.className = "asset-list-body empty-state";
    els.assetList.textContent = "请先上传切图文件夹";
    return;
  }
  const visibleAssets = getVisibleAssets();
  if (!visibleAssets.length) {
    els.assetList.className = "asset-list-body empty-state";
    els.assetList.textContent = "当前没有分辨率问题图片";
    return;
  }

  els.assetList.className = "asset-list-body" + (listDisplayMode === "compact" ? " compact-list-mode" : "");
  els.assetList.innerHTML = "";
  visibleAssets.forEach((asset) => {
    const row = document.createElement("div");
    row.className = "asset-item" + (asset.dimensionIssue ? " has-issue" : asset.dimensionWarning ? " has-warning" : "") + (asset.id === selectedId ? " active" : "");
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
    beforeName.classList.add("full-line");
    afterName.classList.add("full-line", "after-name-line");
    const resolution = createMetaLine("分辨率", formatResolution(asset.dimensions));
    const sizeCategory = createMetaLine("规格", asset.sizeCategoryLabel || getSizeCategoryLabel(asset.dimensions));
    const dimensionCheck = createMetaLine("分辨率检查", asset.dimensionIssue || asset.dimensionWarning ? asset.dimensionIssueMessage : "通过");
    dimensionCheck.classList.toggle("warning-line", asset.dimensionIssue || asset.dimensionWarning);
    const duplicateStatus = getDuplicateStatus(asset);
    const duplicateCheck = createMetaLine("重名检测", duplicateStatus.message);
    duplicateCheck.classList.toggle("warning-line", duplicateStatus.hasIssue);
    const historyMatch = getHistoricalModuleMatch();
    const historyLine = createMetaLine("历史工程", historyMatch ? historyMatch.name + " / " + historyMatch.fileCount + " 张" : "未匹配");
    const status = document.createElement("span");
    status.className = "status-badge status-" + getAssetStatus(asset);
    status.textContent = getAssetStatusText(asset);
    const statusHint = document.createElement("em");
    statusHint.textContent = asset.statusMessage || "";
    text.append(beforeName, afterName, resolution, sizeCategory, dimensionCheck, duplicateCheck, historyLine, status, statusHint);

    const editor = document.createElement("div");
    editor.className = "inline-editor";
    editor.addEventListener("click", (event) => event.stopPropagation());

    const nameRow = document.createElement("div");
    nameRow.className = "inline-name-row";

    const prefix = document.createElement("label");
    prefix.className = "inline-prefix";
    const prefixLabel = document.createElement("span");
    prefixLabel.textContent = "单张前缀";
    const prefixInput = document.createElement("input");
    prefixInput.type = "text";
    prefixInput.value = buildAssetPrefix(asset);
    prefixInput.placeholder = buildPrefix();
    prefixInput.addEventListener("input", () => {
      asset.customPrefix = sanitizePrefix(prefixInput.value);
      afterName.querySelector("strong").textContent = asset.finalBaseName ? buildExportName(asset) : "待命名";
    });
    prefix.append(prefixLabel, prefixInput);

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
      const nameText = document.createElement("span");
      nameText.className = "recommendation-name";
      nameText.textContent = name;
      const meaningText = document.createElement("span");
      meaningText.className = "recommendation-meaning";
      meaningText.textContent = "中文含义：" + explainEnglishName(name);
      button.append(nameText, meaningText);
      button.addEventListener("click", () => {
        asset.finalBaseName = formatNamingName(name);
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
    const finalField = document.createElement("div");
    finalField.className = "inline-final-field";
    const finalInput = document.createElement("input");
    finalInput.type = "text";
    finalInput.value = asset.finalBaseName;
    finalInput.placeholder = "请选择推荐名称或手动输入";
    const finalMeaning = document.createElement("span");
    finalMeaning.className = "name-meaning";
    finalMeaning.textContent = "中文含义：" + explainEnglishName(asset.finalBaseName);
    finalInput.addEventListener("input", () => {
      asset.finalBaseName = formatNamingName(finalInput.value);
      afterName.querySelector("strong").textContent = asset.finalBaseName ? buildExportName(asset) : "待命名";
      finalMeaning.textContent = "中文含义：" + explainEnglishName(asset.finalBaseName);
    });
    finalField.append(finalInput, finalMeaning);
    finalLabel.append(finalText, finalField);

    const lexiconWrap = document.createElement("details");
    lexiconWrap.className = "inline-lexicon";
    lexiconWrap.open = Boolean(asset.lexiconOpen);
    lexiconWrap.addEventListener("toggle", () => {
      asset.lexiconOpen = lexiconWrap.open;
    });
    const lexiconSummary = document.createElement("summary");
    lexiconSummary.textContent = "词库";
    const lexiconContent = document.createElement("div");
    lexiconContent.className = "lexicon-content";
    const categories = buildLexiconCategories();
    if (!categories.some((category) => category.title === activeLexiconCategory)) activeLexiconCategory = categories[0]?.title || "";
    const tabs = document.createElement("div");
    tabs.className = "lexicon-tabs";
    const chips = document.createElement("div");
    chips.className = "lexicon-chips";
    const renderLexiconTerms = () => {
      chips.innerHTML = "";
      const currentParts = new Set(cleanNamingName(asset.finalBaseName).split(/_+/).map((part) => part.toLowerCase()).filter(Boolean));
      const category = categories.find((item) => item.title === activeLexiconCategory) || categories[0];
      (category?.terms || []).forEach((term) => {
        const selected = currentParts.has(term.toLowerCase());
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "lexicon-chip" + (selected ? " selected" : "");
        chip.textContent = term;
        chip.title = selected ? "再次点击移除：" + explainEnglishName(term) : explainEnglishName(term);
        chip.addEventListener("click", () => {
          asset.finalBaseName = toggleLexiconTerm(asset.finalBaseName, term);
          finalInput.value = asset.finalBaseName;
          afterName.querySelector("strong").textContent = asset.finalBaseName ? buildExportName(asset) : "待命名";
          finalMeaning.textContent = "中文含义：" + explainEnglishName(asset.finalBaseName);
          const nextDuplicateStatus = getDuplicateStatus(asset);
          duplicateCheck.querySelector("strong").textContent = nextDuplicateStatus.message;
          duplicateCheck.classList.toggle("warning-line", nextDuplicateStatus.hasIssue);
          renderLexiconTerms();
        });
        chips.appendChild(chip);
      });
    };
    categories.forEach((category) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "lexicon-tab" + (category.title === activeLexiconCategory ? " active" : "");
      tab.textContent = category.title;
      tab.addEventListener("click", () => {
        activeLexiconCategory = category.title;
        tabs.querySelectorAll(".lexicon-tab").forEach((node) => node.classList.toggle("active", node === tab));
        renderLexiconTerms();
      });
      tabs.appendChild(tab);
    });
    renderLexiconTerms();
    lexiconContent.append(tabs, chips);
    lexiconWrap.append(lexiconSummary, lexiconContent);

    nameRow.append(prefix, finalLabel);
    editor.append(nameRow);
    if (listDisplayMode !== "compact") editor.append(recommendationWrap, lexiconWrap);
    row.append(checkbox, img, text, editor);
    els.assetList.appendChild(row);
  });
  protectEditableShortcuts(els.assetList);
}

function fillListDisplayMode() {
  els.listDisplayMode.value = listDisplayMode;
}

function loadListDisplayMode() {
  return localStorage.getItem(LIST_DISPLAY_MODE_KEY) === "compact" ? "compact" : "full";
}

function fillListSortMode() {
  els.listSortMode.value = listSortMode;
}

function loadListSortMode() {
  return normalizeListSortMode(localStorage.getItem(LIST_SORT_MODE_KEY));
}

function normalizeListSortMode(mode) {
  return ["upload", "name-asc", "name-desc"].includes(mode) ? mode : "upload";
}

function getVisibleAssets() {
  const visibleAssets = showProblemOnly ? assets.filter((asset) => asset.dimensionIssue) : [...assets];
  if (listSortMode === "upload") return visibleAssets;
  return [...visibleAssets].sort((left, right) => {
    const leftName = (left.originalBase + left.extension).trim();
    const rightName = (right.originalBase + right.extension).trim();
    const result = leftName.localeCompare(rightName, "zh-Hans-CN", { numeric: true, sensitivity: "base" });
    return listSortMode === "name-desc" ? -result : result;
  });
}

function renderDetectionList() {
  const issueCount = detectionAssets.filter((asset) => asset.hasIssue).length;
  const warningCount = detectionAssets.filter((asset) => asset.hasWarning).length;
  els.detectionCount.textContent = detectionAssets.length + " 张" + (issueCount ? " / " + issueCount + " 张问题" : "") + (warningCount ? " / " + warningCount + " 张警告" : "");
  syncDetectionFilterButtons();

  if (!detectionAssets.length) {
    els.detectionList.className = "asset-list-body empty-state";
    els.detectionList.textContent = "请先上传需要检测的切图文件夹";
    return;
  }

  const visibleAssets = showDetectionProblemOnly
    ? detectionAssets.filter((asset) => asset.hasIssue)
    : showDetectionWarningOnly
      ? detectionAssets.filter((asset) => asset.hasWarning && !asset.hasIssue).sort(compareDetectionWarnings)
      : detectionAssets;
  if (!visibleAssets.length) {
    els.detectionList.className = "asset-list-body empty-state";
    els.detectionList.textContent = showDetectionWarningOnly ? "当前没有警告图片" : "当前没有问题图片";
    return;
  }

  els.detectionList.className = "asset-list-body detection-list";
  els.detectionList.innerHTML = "";
  visibleAssets.forEach((asset) => {
    const row = document.createElement("div");
    row.className = "asset-item detection-item" + (asset.hasIssue ? " has-issue" : asset.hasWarning ? " has-warning" : " passed");

    const img = document.createElement("img");
    img.src = asset.url;
    img.alt = asset.name;

    const meta = document.createElement("div");
    meta.className = "asset-meta";
    const status = document.createElement("span");
    status.className = "status-badge " + (asset.hasIssue ? "status-failed" : asset.hasWarning ? "status-running" : "status-done");
    status.textContent = asset.hasIssue ? "有问题" : asset.hasWarning ? "警告" : "通过";
    meta.append(
      createMetaLine("文件名称", asset.name),
      createMetaLine("分辨率", formatResolution(asset.dimensions)),
      createMetaLine("规格标注", asset.label),
      createMetaLine("检测结果", asset.hasIssue ? asset.messages.join("；") : asset.hasWarning ? asset.warnings.join("；") : "通过"),
      status
    );

    row.append(img, meta);
    els.detectionList.appendChild(row);
  });
}

function compareDetectionWarnings(left, right) {
  return getDetectionWarningSortKey(left).localeCompare(getDetectionWarningSortKey(right), "zh-Hans-CN", {
    numeric: true,
    sensitivity: "base",
  });
}

function getDetectionWarningSortKey(asset) {
  const warningType = getDetectionWarningType(asset);
  const warningText = (asset.warnings || []).join("；");
  const width = String(asset.dimensions?.width || 0).padStart(5, "0");
  const height = String(asset.dimensions?.height || 0).padStart(5, "0");
  return [warningType, warningText, asset.label || "", width, height, asset.name || ""].join("|");
}

function getDetectionWarningType(asset) {
  const warnings = asset.warnings || [];
  if (warnings.some((message) => message.startsWith("疑似重复资源"))) return "01-疑似重复资源";
  if (warnings.some((message) => message.includes("2048") || message.includes("推荐切2张"))) return "02-2048不推荐";
  return "99-其他警告";
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

function getSizeCategoryLabel(dimensions) {
  const validation = validateUploadDimensions(dimensions);
  return validation.label || "通用";
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
  const state = mapped.state || inferState(source, knowledge.stateTerms);
  const candidates = [
    compactParts([kind, state]),
    compactParts([translatedSource || kind]),
    compactParts([kind, pickTerm(knowledge.stateTerms, "Normal", tags.includes("Normal") ? "Normal" : "常态")]),
    ...mapped.direct,
  ];
  return [...new Set(candidates.map(removeProjectTermsFromName).map(formatNamingName).filter(Boolean))].slice(0, 5);
}

function buildLexiconCategories() {
  const knowledge = parseKnowledge();
  const historicalMatch = getHistoricalModuleMatch();
  const dynamicCategories = [
    { title: "当前组件词库", terms: knowledge.componentTerms },
    { title: "当前状态词库", terms: knowledge.stateTerms },
    { title: "历史高频", terms: getHistoricalCommonTerms() },
  ];
  if (historicalMatch) dynamicCategories.unshift({ title: "当前工程历史", terms: historicalMatch.terms.map((item) => item.word) });
  return [...lexiconCategories, ...dynamicCategories]
    .map((category) => ({
      title: category.title,
      terms: uniqueCleanTerms(category.terms).slice(0, 32),
    }))
    .filter((category) => category.terms.length);
}

function uniqueCleanTerms(terms) {
  const seen = new Set();
  const result = [];
  (Array.isArray(terms) ? terms : parseList(terms)).forEach((term) => {
    const clean = formatNamingName(term);
    if (!clean) return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    result.push(clean);
  });
  return result;
}

function appendLexiconTerm(currentName, term) {
  const cleanTerm = formatNamingName(term);
  if (!cleanTerm) return formatNamingName(currentName);
  const parts = formatNamingName(currentName).split(/_+/).filter(Boolean);
  if (parts.some((part) => part.toLowerCase() === cleanTerm.toLowerCase())) return parts.join("_");
  return [...parts, cleanTerm].join("_");
}

function toggleLexiconTerm(currentName, term) {
  const cleanTerm = formatNamingName(term);
  if (!cleanTerm) return formatNamingName(currentName);
  const parts = formatNamingName(currentName).split(/_+/).filter(Boolean);
  const nextParts = parts.filter((part) => part.toLowerCase() !== cleanTerm.toLowerCase());
  if (nextParts.length !== parts.length) return nextParts.join("_");
  return [...parts, cleanTerm].join("_");
}

function getHistoricalKnowledge() {
  return window.NGR_HISTORICAL_KNOWLEDGE || null;
}

function getHistoricalCommonTerms() {
  return (getHistoricalKnowledge()?.commonTerms || []).slice(0, 80).map((item) => item.word);
}

function normalizeHistoryKey(value) {
  return sanitizeName(value).replace(/UI$/i, "").replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

function getHistoricalModuleMatch() {
  const knowledge = getHistoricalKnowledge();
  if (!knowledge?.modules) return null;
  const candidates = [
    rules.projectName,
    els.workProjectName?.value,
    getActiveProject()?.name,
  ].map(normalizeHistoryKey).filter(Boolean);
  for (const candidate of candidates) {
    if (knowledge.modules[candidate]) return knowledge.modules[candidate];
  }
  return null;
}

function getDuplicateStatus(asset) {
  if (!asset.finalBaseName) return { hasIssue: false, message: "待命名" };
  const exportName = buildExportName(asset).toLowerCase();
  const batchCount = assets.filter((item) => item.finalBaseName && buildExportName(item).toLowerCase() === exportName).length;
  if (batchCount > 1) return { hasIssue: true, message: "当前批次重名" };
  const historicalMatch = getHistoricalModuleMatch();
  const historicalNames = historicalMatch?.filenames || [];
  if (historicalNames.some((name) => String(name).toLowerCase() === exportName)) {
    return { hasIssue: true, message: "历史重名：" + historicalMatch.name };
  }
  return historicalMatch ? { hasIssue: false, message: "未重名 / 已匹配 " + historicalMatch.name } : { hasIssue: false, message: "未匹配历史工程" };
}

function inferKind(asset, source, tags, componentTerms = []) {
  const lower = source.toLowerCase();
  const translated = translateTextByDictionary(source).toLowerCase();
  const { width, height } = asset.dimensions;
  if (/bg|background|背景/.test(lower)) return pickTerm(componentTerms, "BG", pickTag(tags, "BG", "背景"));
  if (/btn|button|按钮/.test(lower)) return pickTerm(componentTerms, "Button", pickTag(tags, "Button", "按钮"));
  if (/icon|ico|图标/.test(lower)) return pickTerm(componentTerms, "Icon", pickTag(tags, "Icon", "图标"));
  if (/line|divider|edgeline|线/.test(lower)) return pickTerm(componentTerms, "Line", "Line");
  if (/bar|progress|进度/.test(lower)) return pickTerm(componentTerms, "ProgressBar", "Bar");
  if (/mask|遮罩/.test(lower)) return pickTerm(componentTerms, "Mask", "Mask");
  if (/frame|border|边框/.test(lower)) return pickTerm(componentTerms, "Frame", "Frame");
  if (/light|glow|光/.test(lower)) return pickTerm(componentTerms, "Light", "Light");
  if (/card|卡片/.test(lower)) return pickTerm(componentTerms, "Card", "Card");
  if (/tab/.test(lower)) return pickTerm(componentTerms, "Tab", "Tab");
  if (/logo/.test(lower)) return pickTerm(componentTerms, "Logo", "Logo");
  if (/banner|横幅/.test(lower)) return pickTerm(componentTerms, "Banner", "Banner");
  if (/tab|nav|导航/.test(lower)) return pickTerm(componentTerms, "Nav", "Nav");
  if (/button/.test(translated)) return pickTerm(componentTerms, "Button", pickTag(tags, "Button", "Button"));
  if (/icon/.test(translated)) return pickTerm(componentTerms, "Icon", pickTag(tags, "Icon", "Icon"));
  if (width && height && width > height * 3 && height <= 160) return pickTerm(componentTerms, "Line", "Line");
  if (width && height && height > width * 3 && width <= 160) return pickTerm(componentTerms, "Line", "Line");
  if (width && height && width > height * 2.6) return pickTerm(componentTerms, "Banner", "Banner");
  if (width && height && Math.abs(width - height) < 8 && width <= 160) return pickTerm(componentTerms, "Icon", pickTag(tags, "Icon", "图标"));
  if (width && height && width >= 600 && height >= 300) return pickTerm(componentTerms, "BG", pickTag(tags, "BG", "背景"));
  return pickTerm(componentTerms, "Item", pickTag(tags, "Item", "Item"));
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
  const matched = matchTokenTerm(source, stateTerms);
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

function matchTokenTerm(source, terms) {
  const tokens = getSourceTokens(source);
  return terms.find((term) => tokens.includes(term.toLowerCase())) || "";
}

function keywordMatchesSource(keyword, source, lowerSource = source.toLowerCase()) {
  const cleanKeyword = String(keyword || "").trim();
  if (!cleanKeyword) return false;
  if (/^[A-Za-z0-9]+$/.test(cleanKeyword)) return getSourceTokens(source).includes(cleanKeyword.toLowerCase());
  return lowerSource.includes(cleanKeyword.toLowerCase());
}

function getSourceTokens(source) {
  return source
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split(/_+/)
    .map((token) => token.toLowerCase())
    .filter(Boolean);
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
    if (!keywordMatchesSource(rule.keyword, source, lower)) return;
    const translatedValue = translateRuleValue(rule.value);
    direct.push(translatedValue);
    if (!page && knowledge.pageTerms.some((term) => sameTerm(term, translatedValue) || sameTerm(term, rule.value))) page = translatedValue;
    if (!component && knowledge.componentTerms.some((term) => sameTerm(term, translatedValue) || sameTerm(term, rule.value))) component = translatedValue;
    if (!state && knowledge.stateTerms.some((term) => sameTerm(term, translatedValue) || sameTerm(term, rule.value))) state = translatedValue;
  });
  return { page, component, state, direct };
}

function translateFilename(source, knowledge) {
  const dictionaryName = cleanNamingName(translateTextByDictionary(source)
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9_]+/g, "_"));
  if (dictionaryName) return dictionaryName;
  const mappedValues = [];
  const lower = source.toLowerCase();
  knowledge.filenameRules.forEach((rule) => {
    if (keywordMatchesSource(rule.keyword, source, lower)) mappedValues.push(translateRuleValue(rule.value, knowledge));
  });
  if (mappedValues.length) return compactParts([...new Set(mappedValues)]);
  return "";
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

async function translateTextByApi(text, from, to) {
  if (translationSettings.provider !== "baidu") return "";
  if (!translationSettings.baiduAppId || !translationSettings.baiduSecret) {
    throw new Error("请先填写百度翻译 App ID 和密钥");
  }
  const salt = String(Date.now());
  const query = String(text || "").trim();
  if (!query) return "";
  const sign = md5(translationSettings.baiduAppId + query + salt + translationSettings.baiduSecret);
  const params = new URLSearchParams({
    q: query,
    from,
    to,
    appid: translationSettings.baiduAppId,
    salt,
    sign,
  });
  const response = await fetch(translationSettings.baiduEndpoint + "?" + params.toString());
  if (!response.ok) throw new Error("接口请求失败：" + response.status);
  const data = await response.json();
  if (data.error_code) throw new Error((data.error_code || "") + " " + (data.error_msg || "百度翻译返回错误"));
  return (data.trans_result || []).map((item) => item.dst).join(" ").trim();
}

function explainEnglishName(name) {
  const clean = sanitizeName(name);
  if (!clean) return "待填写";
  const dictionary = buildChineseMeaningDictionary();
  const phraseDictionary = buildChinesePhraseDictionary();
  const words = clean
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split(/_+/)
    .map((word) => word.trim())
    .filter(Boolean);
  const fullPhrase = phraseDictionary[words.join("_").toLowerCase()];
  if (fullPhrase) return fullPhrase;
  const meanings = [];
  for (let index = 0; index < words.length; index += 1) {
    let matched = "";
    let matchedLength = 0;
    for (let length = Math.min(4, words.length - index); length > 1; length -= 1) {
      const key = words.slice(index, index + length).join("_").toLowerCase();
      if (phraseDictionary[key]) {
        matched = phraseDictionary[key];
        matchedLength = length;
        break;
      }
    }
    if (matched) {
      meanings.push(matched);
      index += matchedLength - 1;
    } else {
      const word = words[index];
      meanings.push(dictionary[word.toLowerCase()] || word);
    }
  }
  return meanings.join(" / ");
}

function buildChinesePhraseDictionary() {
  return {
    home_scene_bg: "主页场景底图",
    home_shop_bg: "主页商店底图",
    home_forest_bg: "主页森林底图",
    home_market_bg: "主页市场底图",
    business_record_page_mask: "营业记录页遮罩",
    business_record_page_top_left_control_mask_bg: "营业记录页左上控件遮罩底图",
    business_record_page: "营业记录页",
    record_page_mask: "记录页遮罩",
    page_mask_bottom: "页面底部遮罩",
    top_left: "左上",
    top_right: "右上",
    bottom_left: "左下",
    bottom_right: "右下",
    control_overlay: "控件覆盖层",
    overlay_mask: "覆盖层遮罩",
    travel_journal_title: "外出游历标题",
    travel_journal: "外出游历",
    adventure_note_banner: "冒险记录横幅",
    journey_note_icon: "旅程记录图标",
    white_chrysanthemum_icon: "白菊图标",
    chrysanthemum_white_icon: "白菊图标",
    flower_white_chrysanthemum_icon: "白色菊花图标",
  };
}

function buildChineseMeaningDictionary() {
  const dictionary = {};
  Object.entries(builtinTranslations).forEach(([zh, en]) => {
    dictionary[String(en).toLowerCase()] = zh;
  });
  parseFilenameRules(rules.filenameRules).forEach((rule) => {
    const key = sanitizeName(rule.value).toLowerCase();
    if (key && (!dictionary[key] || /[\u4e00-\u9fa5]/.test(rule.keyword))) dictionary[key] = rule.keyword;
  });
  return {
    ...dictionary,
    bg: dictionary.bg || "背景",
    button: dictionary.button || "按钮",
    icon: dictionary.icon || "图标",
    line: dictionary.line || "线条",
    frame: dictionary.frame || "边框",
    mask: dictionary.mask || "遮罩",
    scene: dictionary.scene || "场景",
    business: dictionary.business || "营业",
    record: dictionary.record || "记录",
    page: dictionary.page || "页面",
    control: dictionary.control || "控件",
    overlay: dictionary.overlay || "覆盖层",
    travel: dictionary.travel || "旅行",
    journal: dictionary.journal || "日志",
    title: dictionary.title || "标题",
    shop: dictionary.shop || "商店",
    forest: dictionary.forest || "森林",
    market: dictionary.market || "市场",
    adventure: dictionary.adventure || "冒险",
    note: dictionary.note || "记录",
    journey: dictionary.journey || "旅程",
    flower: dictionary.flower || "花",
    chrysanthemum: dictionary.chrysanthemum || "菊花",
    card: dictionary.card || "卡片",
    tab: dictionary.tab || "标签",
    panel: dictionary.panel || "面板",
    item: dictionary.item || "通用元素",
    nav: dictionary.nav || "导航",
    cta: "主按钮",
    popup: "弹窗",
    illustration: dictionary.illustration || "插图",
    character: dictionary.character || "角色",
    weapon: dictionary.weapon || "武器",
    rewards: dictionary.rewards || "奖励",
    reward: dictionary.reward || "奖励",
    gift: dictionary.gift || "礼物",
    badge: dictionary.badge || "徽章",
    logo: dictionary.logo || "标识",
    avatar: dictionary.avatar || "头像",
    light: dictionary.light || "光效",
    shadow: dictionary.shadow || "阴影",
    pattern: dictionary.pattern || "纹理",
    ornament: dictionary.ornament || "装饰",
    deco: dictionary.deco || "装饰",
    glow: dictionary.glow || "发光",
    spark: dictionary.spark || "闪光",
    ribbon: dictionary.ribbon || "飘带",
    left: dictionary.left || "左",
    right: dictionary.right || "右",
    top: dictionary.top || "上",
    bottom: dictionary.bottom || "下",
    center: dictionary.center || "中",
    front: dictionary.front || "前",
    back: dictionary.back || "后",
    corner: dictionary.corner || "角",
    red: dictionary.red || "红色",
    blue: dictionary.blue || "蓝色",
    yellow: dictionary.yellow || "黄色",
    green: dictionary.green || "绿色",
    black: dictionary.black || "黑色",
    white: dictionary.white || "白色",
    gold: dictionary.gold || "金色",
    purple: dictionary.purple || "紫色",
    normal: dictionary.normal || "常态",
    hover: dictionary.hover || "悬浮",
    pressed: dictionary.pressed || "按下态",
    selected: dictionary.selected || "选中态",
    unselected: dictionary.unselected || "未选中",
    lock: dictionary.lock || "锁定",
    unlock: dictionary.unlock || "解锁",
    active: dictionary.active || "选中",
    disabled: dictionary.disabled || "禁用",
  };
}

function sameTerm(a, b) {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

function normalizeSourceName(name) {
  return stripProjectTermsFromSource(name
    .replace(/^T_UI_(Img|Icon|Bg|Btn)?_?/i, "")
    .replace(/^T_(Img|Icon|Bg|Btn)_?/i, "")
    .replace(/^(@\d+x|icon-|img-|image-|切图_|切图-)/i, "")
    .replace(/[\s-]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, ""));
}

function stripProjectTermsFromSource(source) {
  let result = sanitizeName(source);
  const projectTerms = getProjectTerms();
  let changed = true;
  while (changed) {
    changed = false;
    projectTerms.forEach((term) => {
      const cleanTerm = sanitizeName(term);
      if (!cleanTerm) return;
      const pattern = new RegExp("^" + escapeRegExp(cleanTerm) + "(_|$)", "i");
      if (pattern.test(result)) {
        result = result.replace(pattern, "").replace(/^_+/, "");
        changed = true;
      }
    });
  }
  return result;
}

function removeProjectTermsFromName(name) {
  const projectTerms = new Set(getProjectTerms().map((term) => sanitizeName(term).toLowerCase()).filter(Boolean));
  return sanitizeName(name)
    .split(/_+/)
    .filter((part) => !projectTerms.has(part.toLowerCase()))
    .join("_");
}

function getProjectTerms() {
  return [
    "Modules",
    "Module",
    rules.projectName,
    getActiveProject()?.name,
    ...(ngrTrainingKnowledge.projectTerms || []),
  ].filter(Boolean);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function cleanNamingName(name) {
  return sanitizeName(name)
    .split(/_+/)
    .map(normalizeNamingPart)
    .filter((part) => part && !FORBIDDEN_NAMING_TERMS.includes(part.toLowerCase()))
    .join("_");
}

function normalizeNamingPart(part) {
  const aliases = {
    bg: "BG",
    background: "BG",
    backgrounds: "BG",
  };
  const clean = sanitizeName(part);
  return aliases[clean.toLowerCase()] || clean;
}

function shouldUseLowercaseNaming() {
  return isYyslsProject(getActiveProject()) || /yysls|燕云|十六声/i.test(rules.projectName || "");
}

function formatNamingName(name) {
  const clean = cleanNamingName(name);
  return shouldUseLowercaseNaming() ? clean.toLowerCase() : clean;
}

function sanitizePrefix(prefix) {
  return String(prefix || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

function appendPart(base, part) {
  const cleanBase = formatNamingName(base);
  const cleanPart = formatNamingName(part);
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
  return buildAssetPrefix(asset) + formatNamingName(asset.finalBaseName) + asset.extension;
}

function buildAssetPrefix(asset) {
  return sanitizePrefix(asset?.customPrefix) || buildPrefix();
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
    contextDocs: els.contextDocs.value.trim(),
  };
}

function fillRulesForm() {
  const project = getActiveProject();
  els.projectConfigName.value = project.name;
  els.projectConfigDescription.value = project.description || "";
  els.schemeName.value = rules.schemeName;
  els.basePrefix.value = rules.basePrefix;
  els.prefixPreset.value = getPrefixPresetValue(rules.basePrefix);
  els.projectName.value = rules.projectName;
  els.workProjectName.value = rules.projectName;
  els.separator.value = rules.separator;
  els.tags.value = rules.tags;
  els.pageTerms.value = rules.pageTerms;
  els.componentTerms.value = rules.componentTerms;
  els.stateTerms.value = rules.stateTerms;
  els.filenameRules.value = rules.filenameRules;
  els.contextDocs.value = rules.contextDocs || "";
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
        ["NGRAI辅助UI切图命名工具 - 方案模板"],
        ["请在各页签中修改“值”或词库内容，保存后回到网页导入。"],
        ["基础配置页：维护方案名称、固定前缀、工程名、分隔符、常用标签。"],
        ["页面词库/组件词库/状态词库：每行填写一个英文命名词。"],
        ["文件名匹配规则：第一列填写中文或英文关键词，第二列填写转换后的英文名。"],
        ["上下文文档：填写项目背景、页面结构和特殊命名约定，AI 会参考这些内容。"],
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
    {
      name: "上下文文档",
      rows: [["项目上下文文档", current.contextDocs || ""]],
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
  const contextRows = readWorksheetRows(xml, "上下文文档").slice(1);
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
  const contextDocs = contextRows.map((row) => row.filter(Boolean).join("\n")).filter(Boolean).join("\n");
  if (contextDocs) next.contextDocs = contextDocs;
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
    if (cleanModule === "上下文文档" && cleanValue) next.contextDocs = [next.contextDocs, cleanValue].filter(Boolean).join("\n");
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
  els.workSchemeSelect.innerHTML = "";
  schemes.forEach((scheme) => {
    const option = document.createElement("option");
    option.value = scheme.schemeName;
    option.textContent = scheme.schemeName;
    option.selected = scheme.schemeName === rules.schemeName;
    els.schemeSelect.appendChild(option);
    const workOption = document.createElement("option");
    workOption.value = scheme.schemeName;
    workOption.textContent = scheme.schemeName;
    workOption.selected = scheme.schemeName === rules.schemeName;
    els.workSchemeSelect.appendChild(workOption);
  });
  els.schemeSelect.value = rules.schemeName;
  els.workSchemeSelect.value = rules.schemeName;
}

function renderProjectSelect() {
  els.projectSelect.innerHTML = "";
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    option.selected = project.id === activeProjectId;
    els.projectSelect.appendChild(option);
  });
}

function renderDetectionProfileSelect() {
  els.detectionProfileSelect.innerHTML = "";
  els.detectionSettingsProfileSelect.innerHTML = "";
  detectionProfiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.name;
    option.selected = profile.id === activeDetectionProfileId;
    els.detectionProfileSelect.appendChild(option);
    const settingsOption = document.createElement("option");
    settingsOption.value = profile.id;
    settingsOption.textContent = profile.name;
    settingsOption.selected = profile.id === activeDetectionProfileId;
    els.detectionSettingsProfileSelect.appendChild(settingsOption);
  });
  els.detectionProfileSelect.value = activeDetectionProfileId;
  els.detectionSettingsProfileSelect.value = activeDetectionProfileId;
  els.detectionModeSelect.value = getActiveDetectionProfile().mode;
  els.duplicateSensitivitySelect.value = getActiveDetectionProfile().duplicateSensitivity;
}

function fillDetectionProfileForm() {
  const profile = getActiveDetectionProfile();
  els.detectionProfileName.value = profile.name;
  els.detectionProfileMode.value = profile.mode;
  els.duplicateSensitivityProfile.value = profile.duplicateSensitivity;
  els.detectionMaxSide.value = profile.maxSide;
  els.detectionBgWidth.value = profile.backgroundWidth;
  els.detectionBgHeight.value = profile.backgroundHeight;
  els.detectionLargeThreshold.value = profile.largeThreshold;
  els.detectionLargeMultiple.value = profile.largeMultiple;
  els.detectionAtlasMultiple.value = profile.atlasMultiple;
}

function collectDetectionProfileForm() {
  const current = getActiveDetectionProfile();
  return normalizeDetectionProfile({
    ...current,
    name: els.detectionProfileName.value,
    mode: els.detectionProfileMode.value,
    duplicateSensitivity: els.duplicateSensitivityProfile.value,
    maxSide: els.detectionMaxSide.value,
    backgroundWidth: els.detectionBgWidth.value,
    backgroundHeight: els.detectionBgHeight.value,
    largeThreshold: els.detectionLargeThreshold.value,
    largeMultiple: els.detectionLargeMultiple.value,
    atlasMultiple: els.detectionAtlasMultiple.value,
  });
}

function updateActiveDetectionProfile(nextProfile, shouldSave) {
  const index = detectionProfiles.findIndex((profile) => profile.id === activeDetectionProfileId);
  if (index >= 0) detectionProfiles[index] = normalizeDetectionProfile(nextProfile);
  if (shouldSave) {
    saveDetectionProfiles();
    renderDetectionProfileSelect();
  }
}

function createDetectionProfile() {
  const base = normalizeDetectionProfile(getActiveDetectionProfile());
  const next = {
    ...base,
    id: "detect-" + Date.now(),
    name: base.name + " 副本",
  };
  detectionProfiles.push(next);
  activeDetectionProfileId = next.id;
  saveDetectionProfiles();
  renderDetectionProfileSelect();
  fillDetectionProfileForm();
  revalidateDetectionAssets();
  showToast("已新增检测项目组");
}

function deleteDetectionProfile() {
  if (detectionProfiles.length <= 1) {
    showToast("至少保留一个检测项目组");
    return;
  }
  detectionProfiles = detectionProfiles.filter((profile) => profile.id !== activeDetectionProfileId);
  activeDetectionProfileId = detectionProfiles[0].id;
  saveDetectionProfiles();
  renderDetectionProfileSelect();
  fillDetectionProfileForm();
  revalidateDetectionAssets();
  showToast("已删除检测项目组");
}

function revalidateDetectionAssets() {
  const profile = getActiveDetectionProfile();
  detectionAssets = detectionAssets.map((asset) => ({
    ...asset,
    ...validateDetectionDimensions(asset.dimensions, profile),
  }));
  updateSimilarResourceWarnings();
  renderDetectionList();
}

function syncWorkProjectFields() {
  const project = getActiveProject();
  if (els.projectSelect.value !== activeProjectId) els.projectSelect.value = activeProjectId;
  els.projectConfigName.value = project.name;
  els.projectConfigDescription.value = project.description || "";
  els.workProjectName.value = rules.projectName;
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

function getPrefixPresetValue(prefix) {
  const presets = ["T_UI", "T_UI_Img", "T_UI_Icon"];
  return presets.includes(prefix) ? prefix : "";
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

function collectTranslationSettings() {
  return normalizeTranslationSettings({
    provider: els.translatorProvider.value || "local",
    baiduAppId: els.baiduTranslateAppId.value.trim(),
    baiduSecret: els.baiduTranslateSecret.value.trim(),
    baiduEndpoint: normalizeTranslateEndpoint(els.baiduTranslateEndpoint.value),
  });
}

function fillTranslationSettings() {
  els.translatorProvider.value = translationSettings.provider;
  els.baiduTranslateAppId.value = translationSettings.baiduAppId;
  els.baiduTranslateSecret.value = translationSettings.baiduSecret;
  els.baiduTranslateEndpoint.value = translationSettings.baiduEndpoint;
}

function loadTranslationSettings() {
  try {
    return normalizeTranslationSettings(JSON.parse(localStorage.getItem(TRANSLATION_SETTINGS_KEY)));
  } catch {
    return normalizeTranslationSettings();
  }
}

function saveTranslationSettings(nextSettings) {
  localStorage.setItem(TRANSLATION_SETTINGS_KEY, JSON.stringify(nextSettings));
}

function normalizeTranslationSettings(nextSettings = {}) {
  nextSettings = nextSettings || {};
  return {
    provider: nextSettings.provider === "baidu" ? "baidu" : "local",
    baiduAppId: nextSettings.baiduAppId || "",
    baiduSecret: nextSettings.baiduSecret || "",
    baiduEndpoint: normalizeTranslateEndpoint(nextSettings.baiduEndpoint || "https://fanyi-api.baidu.com/api/trans/vip/translate"),
  };
}

function normalizeTranslateEndpoint(value) {
  return String(value || "").trim().replace(/\/+$/, "") || "https://fanyi-api.baidu.com/api/trans/vip/translate";
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
    if (Array.isArray(saved) && saved.length) return ensureBuiltinSchemes(saved.map((scheme) => normalizeLoadedRules(scheme)));
  } catch {
    // Ignore invalid local scheme data and rebuild with the default scheme.
  }
  return ensureBuiltinSchemes([normalizeLoadedRules({ ...defaultRules })]);
}

function saveSchemes(nextSchemes) {
  localStorage.setItem(SCHEME_KEY, JSON.stringify(nextSchemes));
}

function loadProjects() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROJECTS_KEY));
    if (Array.isArray(saved) && saved.length) {
      const savedProjects = normalizeProjects(saved);
      return savedProjects.length ? savedProjects : normalizeProjects(buildBuiltinProjects());
    }
  } catch {
    // Rebuild projects below.
  }
  return normalizeProjects(buildBuiltinProjects());
}

function getDefaultDetectionProfiles() {
  return [
    {
      id: "ngr-detection",
      name: "NGR",
      mode: "ngr",
      maxSide: 1024,
      backgroundWidth: 3440,
      backgroundHeight: 1440,
      largeThreshold: 512,
      largeMultiple: 4,
      atlasMultiple: 2,
      duplicateSensitivity: "low",
    },
    {
      id: "more-detection",
      name: "更多项目组正在开发中",
      mode: "ngr",
      maxSide: 1024,
      backgroundWidth: 3440,
      backgroundHeight: 1440,
      largeThreshold: 512,
      largeMultiple: 4,
      atlasMultiple: 2,
      duplicateSensitivity: "low",
    },
  ];
}

function loadDetectionProfiles() {
  try {
    const saved = JSON.parse(localStorage.getItem(DETECTION_PROFILES_KEY));
    if (Array.isArray(saved) && saved.length) return ensureDefaultDetectionProfiles(saved.map(normalizeDetectionProfile));
  } catch {
    // Rebuild below.
  }
  return getDefaultDetectionProfiles().map(normalizeDetectionProfile);
}

function ensureDefaultDetectionProfiles(nextProfiles) {
  const profiles = nextProfiles.map((profile) => {
    if (profile.id === "ngr-detection" || profile.name === "NGR切图检测规范") return { ...profile, id: "ngr-detection", name: "NGR" };
    return profile;
  });
  getDefaultDetectionProfiles().forEach((defaultProfile) => {
    if (!profiles.some((profile) => profile.id === defaultProfile.id)) profiles.push(normalizeDetectionProfile(defaultProfile));
  });
  return profiles;
}

function loadActiveDetectionProfileId(nextProfiles) {
  const saved = localStorage.getItem(ACTIVE_DETECTION_PROFILE_KEY);
  if (saved && nextProfiles.some((profile) => profile.id === saved)) return saved;
  return nextProfiles[0].id;
}

function normalizeDetectionProfile(profile = {}) {
  const defaults = getDefaultDetectionProfiles()[0];
  return {
    id: profile.id || "detect-" + Date.now() + "-" + Math.random().toString(16).slice(2),
    name: String(profile.name || defaults.name).trim() || defaults.name,
    mode: ["ngr", "planner", "icon"].includes(profile.mode) ? profile.mode : defaults.mode,
    duplicateSensitivity: ["low", "medium", "high"].includes(profile.duplicateSensitivity) ? profile.duplicateSensitivity : defaults.duplicateSensitivity,
    maxSide: toPositiveInt(profile.maxSide, defaults.maxSide),
    backgroundWidth: toPositiveInt(profile.backgroundWidth, defaults.backgroundWidth),
    backgroundHeight: toPositiveInt(profile.backgroundHeight, defaults.backgroundHeight),
    largeThreshold: toPositiveInt(profile.largeThreshold, defaults.largeThreshold),
    largeMultiple: toPositiveInt(profile.largeMultiple, defaults.largeMultiple),
    atlasMultiple: toPositiveInt(profile.atlasMultiple, defaults.atlasMultiple),
  };
}

function toPositiveInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function getActiveDetectionProfile() {
  return detectionProfiles.find((profile) => profile.id === activeDetectionProfileId) || detectionProfiles[0];
}

function saveDetectionProfiles() {
  localStorage.setItem(DETECTION_PROFILES_KEY, JSON.stringify(detectionProfiles));
  localStorage.setItem(ACTIVE_DETECTION_PROFILE_KEY, activeDetectionProfileId);
}

function normalizeProjects(nextProjects) {
  return nextProjects
    .filter((project) => project && project.id !== "default" && project.name !== "默认项目")
    .map((project, index) => {
      const schemesForProject = normalizeProjectSchemes(project.name, (project.schemes || []).map((scheme) => normalizeLoadedRules(scheme)));
      const activeSchemeName = schemesForProject.some((scheme) => scheme.schemeName === project.activeSchemeName) ? project.activeSchemeName : schemesForProject[0].schemeName;
      return enrichProjectWithTraining({
        id: project.id || "project-" + index + "-" + Date.now(),
        name: project.name || "未命名项目",
        description: project.description || "",
        activeSchemeName,
        trainingVersion: project.trainingVersion || 0,
        schemes: schemesForProject,
      });
    });
}

function enrichProjectWithTraining(project) {
  if (isYyslsProject(project)) return enrichYyslsProject(project);
  if (!isNgrProject(project)) return project;
  if (project.trainingVersion >= NGR_TRAINING_VERSION && isExactNgrTemplateProject(project)) return project;
  const activeSchemeName = ngrTemplateSchemeNames.includes(project.activeSchemeName) ? project.activeSchemeName : "NGR图集命名规范";
  return {
    ...project,
    activeSchemeName,
    trainingVersion: NGR_TRAINING_VERSION,
    schemes: getNgrTemplateSchemes(),
  };
}

function isNgrProject(project) {
  return project.id === "ngr" || /NGR/i.test(project.name || "");
}

function isYyslsProject(project) {
  return project.id === "yysls" || /yysls|燕云|十六声/i.test(project.name || "");
}

function enrichYyslsProject(project) {
  if (project.trainingVersion >= YYSLS_TRAINING_VERSION) return project;
  return {
    ...project,
    trainingVersion: YYSLS_TRAINING_VERSION,
    schemes: project.schemes.map(enrichSchemeWithYyslsTraining),
  };
}

function isExactNgrTemplateProject(project) {
  const schemeNames = (project.schemes || []).map((scheme) => scheme.schemeName);
  return schemeNames.length === ngrTemplateSchemeNames.length && ngrTemplateSchemeNames.every((name) => schemeNames.includes(name));
}

function getNgrTemplateSchemes() {
  return ngrTemplateSchemes.map((scheme) => normalizeLoadedRules({ ...scheme }));
}

function enrichSchemeWithNgrTraining(scheme) {
  return normalizeLoadedRules({
    ...scheme,
    tags: mergeListText(scheme.tags, "Line, Bar, ProgressBar, Frame, Mask, Light, Pattern, Tab, Card, Selected, Forbidden, Lock, Unlock"),
    pageTerms: removeLineText(scheme.pageTerms, ngrTrainingKnowledge.projectTerms.join("\n")),
    componentTerms: mergeLineText(scheme.componentTerms, ngrTrainingKnowledge.componentTerms),
    stateTerms: mergeLineText(scheme.stateTerms, ngrTrainingKnowledge.stateTerms),
    filenameRules: removeRuleText(mergeRuleText(scheme.filenameRules, ngrTrainingKnowledge.filenameRules), ngrTrainingKnowledge.projectTerms.join("\n")),
    contextDocs: mergeContextText(scheme.contextDocs, ngrTrainingKnowledge.contextDocs),
  });
}

function enrichSchemeWithYyslsTraining(scheme) {
  return normalizeLoadedRules({
    ...scheme,
    tags: mergeListText(scheme.tags, yyslsTrainingKnowledge.tags),
    pageTerms: mergeLineText(scheme.pageTerms, yyslsTrainingKnowledge.pageTerms),
    componentTerms: mergeLineText(scheme.componentTerms, yyslsTrainingKnowledge.componentTerms),
    stateTerms: mergeLineText(scheme.stateTerms, yyslsTrainingKnowledge.stateTerms),
    filenameRules: mergeRuleText(scheme.filenameRules, yyslsTrainingKnowledge.filenameRules),
    contextDocs: mergeContextText(scheme.contextDocs, yyslsTrainingKnowledge.contextDocs),
  });
}

function mergeLineText(currentText, incomingText) {
  const lines = [];
  const seen = new Set();
  String(currentText || "")
    .split(/\n/)
    .concat(String(incomingText || "").split(/\n/))
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      lines.push(line);
    });
  return lines.join("\n");
}

function mergeListText(currentText, incomingText) {
  const items = [];
  const seen = new Set();
  String(currentText || "")
    .split(/[\n,，、]/)
    .concat(String(incomingText || "").split(/[\n,，、]/))
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      items.push(item);
    });
  return items.join(", ");
}

function removeLineText(currentText, removeText) {
  const blocked = new Set(String(removeText || "").split(/\n/).map((line) => line.trim().toLowerCase()).filter(Boolean));
  return String(currentText || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !blocked.has(line.toLowerCase()))
    .join("\n");
}

function removeRuleText(currentText, removeText) {
  const blocked = new Set(String(removeText || "").split(/\n/).map((line) => line.trim().toLowerCase()).filter(Boolean));
  return String(currentText || "")
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !blocked.has(line.split("=")[0].trim().toLowerCase()))
    .join("\n");
}

function mergeContextText(currentText, incomingText) {
  const current = String(currentText || "").trim();
  const incoming = String(incomingText || "").trim();
  if (!current) return incoming;
  if (current.includes("命名结构固定为：T_UI_用户填写工程名_AI生成语义名")) return current;
  return current + "\n\n" + incoming;
}

function normalizeProjectSchemes(projectName, nextSchemes) {
  const defaultProjectName = getDefaultProjectName(projectName);
  const projectSchemes = nextSchemes.length ? nextSchemes : [normalizeLoadedRules({ ...defaultRules, projectName: defaultProjectName })];
  return projectSchemes.map((scheme) => ({
    ...scheme,
    projectName: scheme.projectName === defaultRules.projectName ? defaultProjectName : scheme.projectName,
  }));
}

function getDefaultProjectName(projectName) {
  if (projectName.includes("NGR")) return "NGR";
  if (projectName.includes("yysls")) return "yysls";
  if (projectName.includes("更多")) return "More";
  return sanitizeName(projectName) || defaultRules.projectName;
}

function buildBuiltinProjects() {
  return [
    {
      id: "ngr",
      name: "NGR",
      description: "NGR 项目",
      activeSchemeName: "NGR图集命名规范",
      trainingVersion: NGR_TRAINING_VERSION,
      schemes: getNgrTemplateSchemes(),
    },
    {
      id: "yysls",
      name: "yysls",
      description: "yysls 项目",
      activeSchemeName: "yysls命名规范",
      trainingVersion: YYSLS_TRAINING_VERSION,
      schemes: [
        builtinSchemes[1],
        { ...builtinSchemes[1], schemeName: "yysls拼音混合规范", contextDocs: builtinSchemes[1].contextDocs + "\n优先保留历史拼音词，例如 nielian、jianbian、huawen、zhuangshi、xuanze、yulan。" },
        { ...builtinSchemes[1], schemeName: "yysls通用UI规范", contextDocs: builtinSchemes[1].contextDocs + "\n适合通用 UI 切图，仍需保持全小写 snake_case 和短词/拼音习惯。" },
      ],
    },
    {
      id: "more",
      name: "更多项目正在持续开发中",
      description: "更多项目正在持续开发中",
      activeSchemeName: "更多项目正在持续开发中",
      schemes: [builtinSchemes[2]],
    },
  ];
}

function loadActiveProjectId(nextProjects) {
  const saved = localStorage.getItem(ACTIVE_PROJECT_KEY);
  if (saved && saved !== "default" && nextProjects.some((project) => project.id === saved)) return saved;
  const ngrProject = nextProjects.find((project) => project.id === "ngr" || project.name === "NGR");
  return ngrProject ? ngrProject.id : nextProjects[0].id;
}

function getActiveProject() {
  return projects.find((project) => project.id === activeProjectId) || projects[0];
}

function getProjectActiveScheme(project) {
  return project.schemes.find((scheme) => scheme.schemeName === project.activeSchemeName) || project.schemes[0] || normalizeLoadedRules({ ...defaultRules });
}

function saveProjects() {
  const project = getActiveProject();
  project.schemes = schemes;
  project.activeSchemeName = rules.schemeName;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  localStorage.setItem(ACTIVE_PROJECT_KEY, activeProjectId);
}

function ensureBuiltinSchemes(nextSchemes) {
  const merged = [...nextSchemes];
  builtinSchemes.forEach((scheme) => {
    if (!merged.some((item) => item.schemeName === scheme.schemeName)) {
      merged.push(normalizeLoadedRules(scheme));
    }
  });
  return merged;
}

function upsertScheme(nextRules, shouldSave = true) {
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
  const project = getActiveProject();
  project.schemes = schemes;
  project.activeSchemeName = clean.schemeName;
  if (shouldSave) saveProjects();
}

function normalizeLoadedRules(nextRules) {
  const merged = { ...defaultRules, ...nextRules };
  merged.filenameRules = mergeRuleText(defaultRules.filenameRules, merged.filenameRules);
  merged.filenameRules = enforceNamingRuleAliases(merged.filenameRules);
  return merged;
}

function enforceNamingRuleAliases(ruleText) {
  const overrides = {
    bg: "BG",
    background: "BG",
    backgrounds: "BG",
    reward: "Rewards",
    rewards: "Rewards",
    gloryreward: "GloryRewards",
    gloryrewards: "GloryRewards",
    "底": "BG",
    "背景图": "BG",
  };
  return String(ruleText || "")
    .split("\n")
    .map((line) => {
      const parts = line.split("=");
      const keyword = parts[0]?.trim();
      if (!keyword) return "";
      const key = keyword.toLowerCase();
      const value = overrides[key] || overrides[keyword] || parts.slice(1).join("=").trim() || keyword;
      return keyword + "=" + value;
    })
    .filter(Boolean)
    .join("\n");
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
