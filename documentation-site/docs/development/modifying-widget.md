---
sidebar_position: 3
title: Modifying the Widget
---

# Modifying the Android Widget

This guide covers how to modify the native Android home screen widget layout, update behavior, or data sync.

## Modifying Widget UI / XML Layout

1. Open `android/app/src/main/res/layout/water_cow_widget.xml`.
2. Edit Android XML view definitions (`TextView`, `ProgressBar`, `ImageView`, `LinearLayout`).
3. Rebuild the app using `npx expo run:android` to apply layout updates.

## Modifying Widget Data & Logic in Kotlin

1. Open `android/app/src/main/java/com/watercow/app/WaterCowWidgetProvider.kt`.
2. Update `onUpdate()` or `updateAppWidget()` to compute progress, formatted text, or mood image assets.
3. Update `WaterCowWidgetHelper.kt` if adding new keys to `SharedPreferences`.

## Adding a New Quick-Add Action Button directly on Widget

1. Add a button in `water_cow_widget.xml`:
   ```xml
   <Button
       android:id="@+id/btn_add_500"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="+500ml" />
   ```
2. In `WaterCowWidgetProvider.kt`, attach a `PendingIntent` to `R.id.btn_add_500`:
   ```kotlin
   val intent = Intent(context, WaterCowWidgetProvider::class.java).apply {
       action = ACTION_ADD_WATER
       putExtra("AMOUNT", 500)
   }
   val pendingIntent = PendingIntent.getBroadcast(
       context, 500, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
   )
   views.setOnClickPendingIntent(R.id.btn_add_500, pendingIntent)
   ```
3. In `onReceive()`, handle `ACTION_ADD_WATER`, increment stored intake in `SharedPreferences`, and trigger widget refresh.
