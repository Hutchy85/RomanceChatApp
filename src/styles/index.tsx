import { StyleSheet, DimensionValue } from 'react-native';

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
  border: '#eaeaea', // Added border color
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
    padding: spacing.lg,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullWidthContainer: {
    width: '100%',
  },
  emptyListContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 50, 
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
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: fontSizes.medium,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
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
  emptyListText: {
    fontSize: 16, 
    color: '#888',
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
    marginBottom: spacing.md,
  },
  buttonOutline: {
    backgroundColor: colors.transparent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.md,
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

  saveItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  saveDetails: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 4,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },

  savesList: {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 32,
},

});

export const enhancedStyles = {
  container: {
    flex: 1,
    paddingtop: 16,
    backgroundColor: '#FFF8F5', // Warm background
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 1,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF8F5', // Warm header background
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#E91E63',
    margintop: 16,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center' as const,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dashboardButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  storyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden' as const,
  },
  imageContainer: {
    width: '100%' as DimensionValue,
    height: 200,
    position: 'relative' as const,
  },
  storyImage: {
  width: '100%' as DimensionValue,
  height: '100%' as DimensionValue,
  borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statusBadge: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    backgroundColor: '#00C853',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  progressContainer: {
    position: 'absolute' as const,
    bottom: 12,
    left: 12,
    right: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
  height: 8, // or whatever fixed number you want for the progress bar height
  backgroundColor: '#ff69b4',
  borderRadius: 8,
  },
  storyDetails: {
    padding: 20,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: 8,
  },
  storyDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  storyMeta: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginRight: 16,
    marginBottom: 4,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  storyMetaText: {
    fontSize: 14,
    color: '#888',
  },
  buttonContainer: {
    gap: 12,
  },
  continueButton: {
    backgroundColor: '#00C853',
    paddingVertical: 16,
    borderRadius: 15,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  startButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 15,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  newStoryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E91E63',
    paddingVertical: 14,
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  newStoryButtonText: {
    color: '#E91E63',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loadingContent: {
    alignItems: 'center' as const,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
    fontWeight: '600' as const,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  emptyListText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
  },
};