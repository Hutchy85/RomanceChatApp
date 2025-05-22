import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  primary: '#ff6b6b',
  secondary: '#4ecdc4',
  tertiary: '#ffa502',
  success: '#4caf50',
  background: '#f9f9f9',
  white: '#fff',
  lightGray: '#f0f0f0',
  mediumGray: '#eaeaea',
  darkGray: '#777',
  textDark: '#333',
  textLight: '#fff',
  systemMessage: '#f0f0f0',
  error: '#ff3b30',
  transparent: 'transparent',
};

// Font sizes
export const fontSizes = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  title: 20,
  heading: 24,
};

// Spacing
export const spacing = {
  xs: 5,
  sm: 8,
  md: 10,
  lg: 15,
  xl: 16,
  xxl: 20,
  xxxl: 30,
};

// Border radius
export const borderRadius = {
  sm: 5,
  md: 8,
  lg: 10,
  xl: 18,
  round: 20,
};

// Shadow styles
export const shadows = StyleSheet.create({
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

// Shared styles for containers, cards, buttons, etc.
export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flexOne: {
    flex: 1,
  },
  fullWidthContainer: {
    width: '100%',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Text styles
  title: {
    fontSize: fontSizes.heading,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.lg,
  },
  coloredTitle: {
    fontSize: fontSizes.heading,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: fontSizes.medium,
    lineHeight: 24,
    color: colors.textDark,
    marginBottom: spacing.xl,
  },
  errorText: {
    fontSize: fontSizes.large,
    color: colors.error,
    textAlign: 'center',
    margin: spacing.xxl,
  },
  
  // Cards and content containers
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    ...shadows.light,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonTertiary: {
    backgroundColor: colors.tertiary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.xs,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonOutline: {
    backgroundColor: colors.transparent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.darkGray,
  },
  buttonText: {
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: fontSizes.medium,
  },
  buttonTextOutline: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: fontSizes.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  
  // Form elements
  input: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxHeight: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
  },
  
  // Chat styles
  messagesContent: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  userMessageWrapper: {
    flexDirection: 'row-reverse',
  },
  assistantMessageWrapper: {
    flexDirection: 'row',
  },
  messageContainer: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 0,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: 0,
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: colors.systemMessage,
    maxWidth: '90%',
  },
  messageText: {
    fontSize: fontSizes.medium,
    color: colors.textLight,
  },
  systemMessageText: {
    color: colors.darkGray,
    fontStyle: 'italic',
  },
  timestampText: {
    fontSize: fontSizes.small,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  senderName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: spacing.sm,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  typingText: {
    marginLeft: spacing.xs,
    color: colors.darkGray,
  },
  chatImage: {
    width: 200,
    height: 300,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
    backgroundColor: colors.white,
    padding: spacing.md,
    flexShrink: 0,
  },
  keyboardAvoidingView: { // Added for consistency
    flex: 1,
  },
  
  // List and item styles
  listContainer: {
    paddingBottom: spacing.xxl,
  },
  storyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xxl,
    overflow: 'hidden',
    ...shadows.light,
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.lightGray,
  },
  storyDetails: {
    padding: spacing.xl,
  },
  storyTitle: {
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  storyDescription: {
    fontSize: fontSizes.regular,
    color: colors.textDark,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  storyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  storyMetaText: {
    fontSize: fontSizes.small,
    color: colors.darkGray,
  },

  // Navigation styles
  navigationHeader: {
    backgroundColor: colors.primary,
  },
  navigationHeaderTitle: {
    fontWeight: 'bold',
    // color: colors.textLight, // headerTintColor will handle this
  },
});