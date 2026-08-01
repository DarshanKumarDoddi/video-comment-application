# Crash Report — VidTalk (com.vidtalk.app)

Source: `bugreport-CPH2603IN-BP2A.250605.015-2026-07-30-15-47-00.zip`
Generated: 2026-07-30

## Device

| Field | Value |
|---|---|
| Device | Oppo F25 Pro Plus (CPH2603IN) |
| Android | 16 (API 36), build `BP2A.250605.015` |
| Chipset | MediaTek (arm64-v8a) |
| Build fingerprint | `OPPO/CPH2603IN/OP5A0BL1:16/BP2A.250605.015/U.R4T2.574a15c-32fa661:user/release-keys` |
| App | `com.vidtalk.app` |

## Statistics

- 25 FATAL EXCEPTION blocks logged
- 841 crash stack frames referencing `com.vidtalk.app`
- 12+ distinct APK installs all crashing identically (every EAS build tried)

## Error (every crash identical)

```
java.lang.UnsatisfiedLinkError: dlopen failed: cannot locate symbol
"_ZNKR8facebook3jsi5Value8asObjectERNS0_7RuntimeE"
referenced by "/data/app/.../com.vidtalk.app-xxx==/base.apk!/lib/arm64-v8a/libexpo-av.so"
```

## Full Stack Trace

```
java.lang.UnsatisfiedLinkError: dlopen failed: cannot locate symbol
  "_ZNKR8facebook3jsi5Value8asObjectERNS0_7RuntimeE"
  referenced by ".../lib/arm64-v8a/libexpo-av.so"
	at java.lang.Runtime.loadLibrary0(Runtime.java:1111)
	at java.lang.Runtime.loadLibrary0(Runtime.java:1033)
	at java.lang.System.loadLibrary(System.java:1765)
	at expo.modules.av.AVManager.<clinit>(AVManager.java:56)
	at expo.modules.av.AVPackage.createInternalModules(AVPackage.java:16)
	at expo.modules.adapters.react.ReactModuleRegistryProvider.get(ReactModuleRegistryProvider.java:47)
	at expo.modules.adapters.react.ModuleRegistryAdapter.getOrCreateNativeModulesProxy(ModuleRegistryAdapter.java:136)
	at expo.modules.adapters.react.ModuleRegistryAdapter.createNativeModules(ModuleRegistryAdapter.java:65)
	at expo.modules.ExpoModulesPackage.createNativeModules(ExpoModulesPackage.kt:35)
	at com.facebook.react.ReactPackageTurboModuleManagerDelegate.initialize(ReactPackageTurboModuleManagerDelegate.kt:64)
	at com.facebook.react.ReactPackageTurboModuleManagerDelegate.<init>(ReactPackageTurboModuleManagerDelegate.kt:42)
	at com.facebook.react.defaults.DefaultTurboModuleManagerDelegate.<init>(DefaultTurboModuleManagerDelegate.kt:35)
	at com.facebook.react.defaults.DefaultTurboModuleManagerDelegate$Builder.build(DefaultTurboModuleManagerDelegate.kt:63)
	at com.facebook.react.runtime.ReactInstance.<init>(ReactInstance.kt:183)
	at com.facebook.react.runtime.ReactHostImpl.getOrCreateReactInstanceTask(ReactHostImpl.kt:1052)
	at com.facebook.react.runtime.internal.bolts.Task$Companion.completeImmediately(Task.kt:358)
	at com.facebook.react.runtime.internal.bolts.Task$Companion.access$completeImmediately(Task.kt:254)
	at com.facebook.react.runtime.internal.bolts.Task.continueWith(Task.kt:133)
	at com.facebook.react.runtime.internal.bolts.Task.continueWith$default(Task.kt:117)
	at com.facebook.react.runtime.internal.bolts.Task.onSuccess$lambda$12(Task.kt:176)
	at com.facebook.react.runtime.internal.bolts.Task$Companion.completeAfterTask$lambda$5(Task.kt:394)
	at com.facebook.react.runtime.internal.bolts.Executors$ImmediateExecutor.execute(Executors.kt:41)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1100)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at java.lang.Thread.run(Thread.java:1572)
```

## Root Cause

### 1. The dependency is obsolete for this SDK (primary cause)

`expo-av@16.0.8` is **not compatible with Expo SDK 57**. It is a legacy module from Expo SDK 54, and `expo-av` was **deprecated in SDK 54 and removed entirely from SDK 55+**.

Verified: `expo-av` is absent from `node_modules/expo/bundledNativeModules.json` for this project — meaning `npx expo install` can never align it to SDK 57. It is an orphaned leftover that was manually added to `package.json`.

- Installed: `expo-av@^16.0.8` (compiled against React Native 0.81 / Hermes of the SDK 54 era)
- Project: `expo@~57.0.8`, `react-native@0.86.0` (Hermes of the RN 0.86 era)

### 2. Hermes JSI C++ ABI mismatch (the actual crash mechanism)

The symbol that fails to load:

```
_ZNKR8facebook3jsi5Value8asObjectERNS0_7RuntimeE
```

demangles to:

```
facebook::jsi::Value::asObject(facebook::jsi::Runtime&)
```

`libexpo-av.so` is a precompiled native library. During the build it was compiled against the Hermes/JSI headers of RN 0.81 (SDK 54). The app, however, links against the Hermes of RN 0.86 (SDK 57). The JSI C++ ABI changed between these Hermes versions, so the symbol emitted by `libexpo-av.so` does not exist in the runtime Hermes.

At launch, `AVManager.<clinit>` calls `System.loadLibrary("expo-av")`. `dlopen` must resolve every undefined symbol against already-loaded libraries; it cannot find this Hermes symbol, so it aborts with `UnsatisfiedLinkError`. This happens during TurboModule initialization — **before any JavaScript executes** — so no JS-level fix could ever resolve it.

### 3. Additional ABI-mismatched dependencies (latent risk)

`npx expo install --check` reports further out-of-sync packages that can cause the same class of crash:

| Package | Installed | SDK 57 expects |
|---|---|---|
| `expo` | 57.0.8 | ~57.0.9 |
| `react-native` | 0.86.0 | 0.86.2 |
| `react-native-gesture-handler` | 3.1.0 | ~2.32.0 |
| `react-native-safe-area-context` | 5.8.0 | ~5.7.0 |
| `expo-constants` / `expo-image-picker` / `expo-notifications` / `expo-router` | patch behind | ~57.0.x |

## Fix Applied

Switched `app.json` to `"jsEngine": "jsc"` (JavaScriptCore) to bypass Hermes entirely, eliminating the Hermes JSI ABI mismatch. Build `2fddbf10-76db-4142-9863-64718cbcb618` is running to verify.

## Long-Term Fix

- Remove `expo-av` and migrate to a supported replacement (`expo-audio` / `expo-video`) or pin the project to a lower Expo SDK that still bundles `expo-av`.
- Run `npx expo install --fix` to align all other dependencies to SDK 57 versions.

## Raw Logs

Full raw bugreport (161,703 lines): `/tmp/opencode/bugreport/bugreport-CPH2603IN-BP2A.250605.015-2026-07-30-15-47-00.txt`
First crash block begins at line 35571.
