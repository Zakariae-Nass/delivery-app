/**
 * media.service.js
 *
 * Technical actions related to device media (camera roll, image picker).
 * Centralises expo-image-picker usage and handles all exceptions internally.
 */

import * as ImagePicker from 'expo-image-picker';

/**
 * Opens the device image library and returns the selected image URI,
 * or null if the user cancels or permission is denied.
 *
 * @param {{ aspect?: [number,number], quality?: number }} options
 * @returns {Promise<string|null>}
 */
export async function pickImageFromLibrary({ aspect = [1, 1], quality = 0.85 } = {}) {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect,
      quality,
    });

    if (!result.canceled && result.assets?.length) {
      return result.assets[0].uri;
    }
    return null;
  } catch {
    return null;
  }
}
