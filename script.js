document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('language') || 'en';

    const translations = {
        en: {
            appTitle: "User Data Info",
            pageTitle: "Your Device & Browser Information",
            ipAddressLabel: "IP Address",
            browserLabel: "Browser",
            osLabel: "Operating System",
            cpuLabel: "CPU",
            screenResolutionLabel: "Screen Resolution",
            windowSizeLabel: "Window Size",
            languageLabel: "Preferred Lang. (Browser)",
            onlineStatusLabel: "Online Status",
            cookiesEnabledLabel: "Cookies Enabled",
            timezoneLabel: "Timezone",
            currentTimeLabel: "Current Time (Local)",
            langOptionEn: "English",
            geolocationLabel: "Geolocation",
            getGeolocationBtn: "Get Geolocation",
            geolocationInitialPrompt: "Click button to request location",
            requestingLocation: "Requesting permission...",
            retryGeolocationBtn: "Retry Geolocation",
            geolocationDenied: "Error: Geolocation permission denied.",
            geolocationUnavailable: "Error: Location information unavailable.",
            geolocationTimeout: "Error: Location request timed out.",
            geolocationUnknownError: "Error: Unknown geolocation error.",
            geolocationNotSupported: "Geolocation not supported.",
            batteryLabel: "Battery Status",
            getBatteryBtn: "Get Status",
            batteryInitialPrompt: "Click button to request status",
            batteryCharging: "Charging:",
            batteryNotCharging: "Not Charging",
            batteryLevel: "Level:",
            batteryChargingTime: "Time to full:",
            batteryDischargingTime: "Time to empty:",
            networkTypeLabel: "Network Type",
            deviceMemoryLabel: "Device Memory (approx.)",
            screenColorDepthLabel: "Screen Color Depth",
            screenOrientationLabel: "Screen Orientation",
            touchSupportLabel: "Touch Support",
            doNotTrackLabel: "Do Not Track",
            pdfViewerLabel: "PDF Viewer Enabled",
            webglInfoLabel: "WebGL Info",
            renderer: "Renderer:",
            vendor: "Vendor:",
            yes: "Yes",
            no: "No",
            notSpecified: "Not Specified / Off",
            on: "On",
            userAgentLabel: "User Agent",
            themeToggleDark: "Dark Mode",
            themeToggleLight: "Light Mode",
            loading: "Loading...",
            notAvailable: "N/A",
            couldNotFetchIP: "Could not fetch IP",
            error: "Error"
        },
        ar: {
            appTitle: "معلومات المستخدم",
            pageTitle: "معلومات جهازك ومتصفحك",
            ipAddressLabel: "عنوان IP",
            browserLabel: "المتصفح",
            osLabel: "نظام التشغيل",
            cpuLabel: "المعالج (CPU)",
            screenResolutionLabel: "دقة الشاشة",
            windowSizeLabel: "حجم النافذة",
            languageLabel: "اللغة المفضلة (المتصفح)",
            onlineStatusLabel: "حالة الاتصال",
            cookiesEnabledLabel: "ملفات تعريف الارتباط مفعلة",
            timezoneLabel: "المنطقة الزمنية",
            currentTimeLabel: "الوقت الحالي (محلي)",
            langOptionAr: "العربية",
            geolocationLabel: "الموقع الجغرافي",
            getGeolocationBtn: "الحصول على الموقع",
            geolocationInitialPrompt: "انقر على الزر لطلب الموقع",
            requestingLocation: "جارٍ طلب الإذن...",
            retryGeolocationBtn: "إعادة محاولة تحديد الموقع",
            geolocationDenied: "خطأ: تم رفض إذن تحديد الموقع.",
            geolocationUnavailable: "خطأ: معلومات الموقع غير متوفرة.",
            geolocationTimeout: "خطأ: انتهت مهلة طلب الموقع.",
            geolocationUnknownError: "خطأ: خطأ غير معروف في تحديد الموقع.",
            geolocationNotSupported: "الموقع الجغرافي غير مدعوم.",
            batteryLabel: "حالة البطارية",
            getBatteryBtn: "طلب الحالة",
            batteryInitialPrompt: "انقر لطلب الحالة",
            batteryCharging: "الشحن:",
            batteryNotCharging: "لا يتم الشحن",
            batteryLevel: "المستوى:",
            batteryChargingTime: "الوقت للاكتمال:",
            batteryDischargingTime: "الوقت للتفريغ:",
            networkTypeLabel: "نوع الشبكة",
            deviceMemoryLabel: "ذاكرة الجهاز (تقريبًا)",
            screenColorDepthLabel: "عمق ألوان الشاشة",
            screenOrientationLabel: "اتجاه الشاشة",
            touchSupportLabel: "دعم اللمس",
            doNotTrackLabel: "عدم التعقب",
            pdfViewerLabel: "عارض PDF مفعل",
            webglInfoLabel: "معلومات WebGL",
            renderer: "العارض:",
            vendor: "المصنع:",
            yes: "نعم",
            no: "لا",
            notSpecified: "غير محدد / متوقف",
            on: "يعمل",
            userAgentLabel: "وكيل المستخدم",
            themeToggleDark: "الوضع الداكن",
            themeToggleLight: "الوضع الفاتح",
            loading: "جار التحميل...",
            notAvailable: "غير متاح",
            couldNotFetchIP: "تعذر جلب IP",
            error: "خطأ"
        }
    };

    const display = (id, value) => {
        const el = document.getElementById(id);
        if (el) {
            const notAvailableText = translations[currentLang]?.notAvailable || translations.en.notAvailable;
            el.textContent = value !== undefined && value !== null && String(value).trim() !== '' ? String(value) : notAvailableText;
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    };

    // --- Element Getters ---
    const themeSwitch = document.getElementById('themeSwitch');
    const themeLabel = document.getElementById('themeLabel');
    const languageSelect = document.getElementById('languageSelect');

    // 1. IP Address (using ipify API)
    async function fetchIpAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            display('ipAddress', data.ip); // Dynamic data, not a translation key
        } catch (error) {
            console.error('Error fetching IP address:', error);
            display('ipAddress', translations[currentLang]?.couldNotFetchIP || translations.en.couldNotFetchIP);
        }
    }

    // 2. Browser and OS Info (using UAParser.js)
    function displayBrowserAndOsInfo() {
        try {
            const parser = new UAParser();
            const result = parser.getResult();

            display('browserName', result.browser.name);
            display('browserVersion', result.browser.version);
            display('osName', result.os.name);
            display('osVersion', result.os.version);
            display('userAgent', navigator.userAgent);
        } catch (e) {
            console.error("Error parsing User Agent:", e);
            display('browserName', translations[currentLang]?.error || translations.en.error);
            display('userAgent', navigator.userAgent || (translations[currentLang]?.notAvailable || translations.en.notAvailable));
        }
    }

    // 3. CPU Cores
    function displayCpuInfo() {
        display('cpuCores', navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} logical cores` : 'N/A');
    }

    // 4. Screen Resolution
    function displayScreenResolution() {
        display('screenResolution', `${screen.width} x ${screen.height} pixels`);
    }

    // 5. Window Size
    function displayWindowSize() {
        const updateSize = () => {
            display('windowSize', `${window.innerWidth} x ${window.innerHeight} pixels`);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
    }

    // 6. Language
    function displayLanguage() {
        display('language', navigator.language || (navigator.languages && navigator.languages[0]) || 'N/A');
    }

    // 7. Online Status
    function displayOnlineStatus() {
        const updateStatus = () => {
            display('onlineStatus', navigator.onLine ? 'Online' : 'Offline');
        };
        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
    }

    // 8. Cookies Enabled
    function displayCookiesEnabled() {
        display('cookiesEnabled', navigator.cookieEnabled ? 'Yes' : 'No');
    }

    // 9. Timezone
    function displayTimezone() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            display('timezone', timezone);
        } catch (e) {
            display('timezone', translations[currentLang]?.notAvailable || translations.en.notAvailable);
        }
    }

    // 10. Current Time
    function displayCurrentTime() {
        const updateTime = () => {
            display('currentTime', new Date().toLocaleString());
        };
        updateTime();
        setInterval(updateTime, 1000); // Update every second
    }

    // --- Theme Switcher ---
    function updateThemeButtonText() {
        if (themeLabel) {
            const isDark = document.body.classList.contains('dark-mode');
            const textKey = isDark ? 'themeToggleLight' : 'themeToggleDark';
            themeLabel.textContent = translations[currentLang]?.[textKey] || translations.en[textKey];
        }
    }

    // --- Language Switcher ---
    function applyTranslations() {
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (translations[currentLang] && translations[currentLang][key]) {
                // For buttons, set textContent. For title, also.
                // Also handle OPTION elements
                if (el.tagName === 'TITLE' || el.tagName === 'BUTTON' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'SPAN' || el.tagName === 'OPTION') {
                     el.textContent = translations[currentLang][key];
                }
            } else if (translations.en && translations.en[key]) { // Fallback to English
                 if (el.tagName === 'TITLE' || el.tagName === 'BUTTON' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'SPAN' || el.tagName === 'OPTION') {
                    el.textContent = translations.en[key];
                 }
            }
        });
        document.title = translations[currentLang]?.appTitle || translations.en.appTitle; // Set document title
    }

    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', lang);
        applyTranslations();
        updateThemeButtonText(); // Update theme label text as it's translated
        if (languageSelect) languageSelect.value = lang; // Set the dropdown value
    }

    // --- New Technical Info Functions ---

    // 12. Battery Status
    function setupBatteryInfo() {
        const batteryItem = document.getElementById('batteryItem');
        const getBatteryBtn = document.getElementById('getBatteryBtn');
        const batteryLevelDisplay = document.getElementById('batteryLevel');
        const batteryChargingDisplay = document.getElementById('batteryCharging');
        const batteryChargingTimeDisplay = document.getElementById('batteryChargingTime');
        const batteryDischargingTimeDisplay = document.getElementById('batteryDischargingTime');

        if ('getBattery' in navigator) {
            if (batteryItem) batteryItem.style.display = 'flex';

            const updateBatteryUI = (battery) => {
                if (!battery) return;
                const notAvailableText = translations[currentLang]?.notAvailable || translations.en.notAvailable;
                const levelText = translations[currentLang]?.batteryLevel || translations.en.batteryLevel;
                const chargingText = translations[currentLang]?.batteryCharging || translations.en.batteryCharging;
                const notChargingText = translations[currentLang]?.batteryNotCharging || translations.en.batteryNotCharging;
                const chargingTimeText = translations[currentLang]?.batteryChargingTime || translations.en.batteryChargingTime;
                const dischargingTimeText = translations[currentLang]?.batteryDischargingTime || translations.en.batteryDischargingTime;

                display('batteryLevel', `${levelText} ${(battery.level * 100).toFixed(0)}%`);
                display('batteryCharging', battery.charging ? chargingText : notChargingText);
                
                display('batteryChargingTime', battery.chargingTime === Infinity ? notAvailableText : `${chargingTimeText} ${formatTime(battery.chargingTime)}`);
                batteryChargingTimeDisplay.style.display = battery.charging ? 'block' : 'none';

                display('batteryDischargingTime', battery.dischargingTime === Infinity ? notAvailableText : `${dischargingTimeText} ${formatTime(battery.dischargingTime)}`);
                batteryDischargingTimeDisplay.style.display = !battery.charging ? 'block' : 'none';

                if (getBatteryBtn) getBatteryBtn.style.display = 'none'; // Hide button after success
            };

            const formatTime = (seconds) => {
                if (seconds === Infinity || isNaN(seconds)) return translations[currentLang]?.notAvailable || translations.en.notAvailable;
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                return `${h}h ${m}m`;
            };

            if (getBatteryBtn) {
                getBatteryBtn.addEventListener('click', async () => {
                    try {
                        const battery = await navigator.getBattery();
                        updateBatteryUI(battery);
                        battery.addEventListener('levelchange', () => updateBatteryUI(battery));
                        battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
                        battery.addEventListener('chargingtimechange', () => updateBatteryUI(battery));
                        battery.addEventListener('dischargingtimechange', () => updateBatteryUI(battery));
                    } catch (err) {
                        console.error("Error getting battery status:", err);
                        if (batteryLevelDisplay) batteryLevelDisplay.textContent = translations[currentLang]?.error || translations.en.error;
                    }
                });
            }
        } else {
            if (batteryLevelDisplay) batteryLevelDisplay.textContent = translations[currentLang]?.notAvailable || translations.en.notAvailable;
            if (batteryChargingDisplay) batteryChargingDisplay.textContent = '';
            if (batteryChargingTimeDisplay) batteryChargingTimeDisplay.textContent = '';
            if (batteryDischargingTimeDisplay) batteryDischargingTimeDisplay.textContent = '';
        }
    }

    // 13. Network Type
    function displayNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let type = connection ? connection.effectiveType : (translations[currentLang]?.notAvailable || translations.en.notAvailable);
        if (connection && connection.type) { // Some browsers might have `type` instead of `effectiveType`
            type = connection.type;
        }
        display('networkType', type.toUpperCase());
    }

    // 14. Device Memory
    function displayDeviceMemory() {
        const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : (translations[currentLang]?.notAvailable || translations.en.notAvailable);
        display('deviceMemory', memory);
    }

    // 15. Screen Color Depth & Orientation
    function displayScreenDetails() {
        display('screenColorDepth', `${screen.colorDepth}-bit`);
        const updateOrientation = () => {
            display('screenOrientationType', screen.orientation ? screen.orientation.type : (translations[currentLang]?.notAvailable || translations.en.notAvailable));
            display('screenOrientationAngle', screen.orientation ? `${screen.orientation.angle}°` : (translations[currentLang]?.notAvailable || translations.en.notAvailable));
        };
        updateOrientation();
        if (screen.orientation) {
            screen.orientation.addEventListener('change', updateOrientation);
        }
    }

    // 16. Touch Support
    function displayTouchSupport() {
        const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        display('touchSupport', hasTouch ? (translations[currentLang]?.yes || translations.en.yes) : (translations[currentLang]?.no || translations.en.no));
    }

    // 17. Do Not Track
    function displayDoNotTrack() {
        const dnt = navigator.doNotTrack;
        let dntStatus = translations[currentLang]?.notAvailable || translations.en.notAvailable;
        if (dnt === "1") dntStatus = translations[currentLang]?.on || translations.en.on;
        else if (dnt === "0") dntStatus = translations[currentLang]?.no || translations.en.no; // Or "Off"
        else if (dnt === null || dnt === "unspecified") dntStatus = translations[currentLang]?.notSpecified || translations.en.notSpecified;
        display('doNotTrack', dntStatus);
    }

    // 18. PDF Viewer Enabled
    function displayPdfViewerStatus() {
        display('pdfViewerEnabled', navigator.pdfViewerEnabled ? (translations[currentLang]?.yes || translations.en.yes) : (translations[currentLang]?.no || translations.en.no));
    }

    // 11. Geolocation (optional, with user permission)
    function setupGeolocation() {
        const geolocationItem = document.getElementById('geolocationItem');
        const getGeolocationBtn = document.getElementById('getGeolocationBtn');
        const geolocationDisplay = document.getElementById('geolocation');

        if (navigator.geolocation) {
            if (geolocationItem) geolocationItem.style.display = 'flex'; // Show the section

            if (getGeolocationBtn && geolocationDisplay) {
                getGeolocationBtn.addEventListener('click', () => {
                    geolocationDisplay.textContent = translations[currentLang]?.requestingLocation || translations.en.requestingLocation;
                    getGeolocationBtn.disabled = true;
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude, accuracy } = position.coords;
                            geolocationDisplay.textContent = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Accuracy: ${accuracy.toFixed(0)}m)`;
                            getGeolocationBtn.style.display = 'none'; // Hide button after success
                        },
                        (error) => {
                            let errorKey = 'geolocationUnknownError';
                            if (error.code === error.PERMISSION_DENIED) errorKey = "geolocationDenied";
                            else if (error.code === error.POSITION_UNAVAILABLE) errorKey = "geolocationUnavailable";
                            else if (error.code === error.TIMEOUT) errorKey = "geolocationTimeout";

                            geolocationDisplay.textContent = translations[currentLang]?.[errorKey] || translations.en[errorKey];
                            console.error('Geolocation error:', error);
                            getGeolocationBtn.disabled = false;
                            getGeolocationBtn.textContent = translations[currentLang]?.retryGeolocationBtn || translations.en.retryGeolocationBtn;
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                });
            }
        } else {
            if (geolocationDisplay) geolocationDisplay.textContent = translations[currentLang]?.geolocationNotSupported || translations.en.geolocationNotSupported;
            if (getGeolocationBtn) getGeolocationBtn.style.display = 'none';
        }
    }

    // 19. WebGL Info
    function displayWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                display('webglRenderer', debugInfo ? `${translations[currentLang]?.renderer || translations.en.renderer} ${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}` : (translations[currentLang]?.notAvailable || translations.en.notAvailable));
                display('webglVendor', debugInfo ? `${translations[currentLang]?.vendor || translations.en.vendor} ${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}` : (translations[currentLang]?.notAvailable || translations.en.notAvailable));
            } else {
                throw new Error("WebGL not supported");
            }
        } catch (e) {
            display('webglRenderer', translations[currentLang]?.notAvailable || translations.en.notAvailable);
            display('webglVendor', '');
        }
    }

    // --- Initialization ---

    // Initial Theme Setup
    const initialUserTheme = localStorage.getItem('theme') || 'light';
    const isInitialDark = initialUserTheme === 'dark';
    document.body.classList.toggle('dark-mode', isInitialDark);
    if (themeSwitch) themeSwitch.checked = isInitialDark; // Set initial state of the switch

    // Initial Language Setup (this calls applyTranslations and updateThemeButtonText)
    setLanguage(currentLang);

    // Theme Toggle Event Listener
    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateThemeButtonText();
        });
    }
    // Language Switcher Event Listener
    if (languageSelect) languageSelect.addEventListener('change', (event) => setLanguage(event.target.value));

    // Fetch and display dynamic data
    Promise.allSettled([fetchIpAddress()]) // IP address is async
        .then(() => { // Load others after IP attempt or in parallel
            displayBrowserAndOsInfo();
            displayCpuInfo();
            displayScreenResolution();
            displayWindowSize();
            displayLanguage();
            displayOnlineStatus();
            displayCookiesEnabled();
            displayTimezone();
            displayCurrentTime();
            setupGeolocation();
        });
});