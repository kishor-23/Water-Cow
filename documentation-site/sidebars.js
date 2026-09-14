/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/development-environment',
        'getting-started/running',
        'getting-started/building',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Architecture',
      items: [
        'architecture/overview',
        'architecture/folder-structure',
        'architecture/data-flow',
        'architecture/state-management',
        'architecture/navigation',
        'architecture/decisions',
      ],
    },
    {
      type: 'category',
      label: '✨ Features',
      items: [
        'features/water-tracking',
        'features/reminders',
        'features/notifications',
        'features/notification-sounds',
        'features/widget',
        'features/cow-mascot',
        'features/theming',
        'features/backup-restore',
      ],
    },
    {
      type: 'category',
      label: '⚛️ React Native',
      items: [
        'react-native/concepts',
        'react-native/components',
        'react-native/hooks-and-effects',
        'react-native/custom-hooks',
      ],
    },
    {
      type: 'category',
      label: '🤖 Android',
      items: [
        'android/overview',
        'android/sdk',
        'android/jdk',
        'android/gradle',
        'android/native-code',
        'android/widget',
      ],
    },
    {
      type: 'category',
      label: '📦 Expo',
      items: [
        'expo/overview',
        'expo/expo-go-vs-dev-build',
        'expo/prebuild',
        'expo/eas',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Development',
      items: [
        'development/adding-features',
        'development/modifying-notifications',
        'development/modifying-widget',
        'development/where-to-change',
        'development/commands',
        'development/debugging',
      ],
    },
    {
      type: 'category',
      label: '🔧 Troubleshooting',
      items: [
        'troubleshooting/build-errors',
        'troubleshooting/notification-errors',
        'troubleshooting/widget-errors',
        'troubleshooting/common-errors',
      ],
    },
  ],
};

export default sidebars;
