import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

// Type navigation prop for safety
type NavigationProp = StackNavigationProp<RootStackParamList>;

const HeaderMenu = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={{ flexDirection: 'row', paddingRight: 8 }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="dots-vertical"
            size={24}
            onPress={openMenu}
            iconColor="white"
          />
        }
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('StoryDashboard');
          }}
          title="View Progress"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('userProfile');
          }}
          title="Profile"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('SaveManager');
          }}
          title="Manage Save Data"
        />
      </Menu>
    </View>
  );
};

export default HeaderMenu;
