import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { UserProfileContext } from '../../contexts/UserProfileContext';
import { colors, fontSizes, spacing, borderRadius, shadows, commonStyles } from '../../styles';
import type { StackNavigationProp } from '@react-navigation/stack';

type UserProfileScreenProps = {
  navigation: StackNavigationProp<any>;
};

const pronounOptions = [
  { subject: 'he', object: 'him', possessive: 'his', display: 'He/Him' },
  { subject: 'she', object: 'her', possessive: 'her', display: 'She/Her' },
  { subject: 'they', object: 'them', possessive: 'their', display: 'They/Them' },
];

export default function UserProfileScreen({ navigation }: UserProfileScreenProps) {
  const { updateProfile } = useContext(UserProfileContext)!;

  const [playerName, setPlayerName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [selectedPronouns, setSelectedPronouns] = useState(2); // Default to they/them

  const validateInputs = () => {
    if (!playerName.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return false;
    }
    if (!partnerName.trim()) {
      Alert.alert('Missing Information', 'Please enter your partner\'s name');
      return false;
    }
    return true;
  };

  const saveProfile = () => {
    if (!validateInputs()) return;

    updateProfile({
      playerName: playerName.trim(),
      partnerName: partnerName.trim(),
      pronouns: {
        subject: pronounOptions[selectedPronouns].subject,
        object: pronounOptions[selectedPronouns].object,
        possessive: pronounOptions[selectedPronouns].possessive,
      },
    });
    navigation.navigate('StorySelection');
  };

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={commonStyles.scrollContent}>
          <View style={styles.header}>
            <Text style={commonStyles.coloredTitle}>Let's Get Started!</Text>
            <Text style={commonStyles.subtitle}>
              Tell us about yourself and your partner to personalize your story experience
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.textInput}
                value={playerName}
                onChangeText={setPlayerName}
                placeholder="Enter your name"
                placeholderTextColor={colors.darkGray}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Partner's Name</Text>
              <TextInput
                style={styles.textInput}
                value={partnerName}
                onChangeText={setPartnerName}
                placeholder="Enter your partner's name"
                placeholderTextColor={colors.darkGray}
                returnKeyType="done"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Pronouns</Text>
              <View style={styles.pronounContainer}>
                {pronounOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pronounButton,
                      selectedPronouns === index && styles.pronounButtonSelected,
                    ]}
                    onPress={() => setSelectedPronouns(index)}
                  >
                    <Text
                      style={[
                        styles.pronounText,
                        selectedPronouns === index && styles.pronounTextSelected,
                      ]}
                    >
                      {option.display}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={commonStyles.buttonPrimary} onPress={saveProfile}>
            <Text style={commonStyles.buttonText}>Continue to Stories</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.xxl,
  },
  form: {
    paddingHorizontal: spacing.xl,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.xxxl,
  },
  label: {
    fontSize: fontSizes.medium,
    fontWeight: '600' as const,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    ...shadows.light,
  },
  pronounContainer: {
    flexDirection: 'row' as const,
    gap: spacing.md,
  },
  pronounButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center' as const,
    ...shadows.light,
  },
  pronounButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  pronounText: {
    fontSize: fontSizes.regular,
    fontWeight: '500' as const,
    color: colors.darkGray,
  },
  pronounTextSelected: {
    color: colors.textLight,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xxl,
  },
};