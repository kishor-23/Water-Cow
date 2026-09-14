# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Optimization directives
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# react-native-reanimated & React Native
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.** { *; }
-keep class expo.modules.** { *; }

# WaterCow app & Widget
-keep class com.watercow.app.** { *; }
-keepclassmembers class com.watercow.app.R$* {
    public static <fields>;
}
