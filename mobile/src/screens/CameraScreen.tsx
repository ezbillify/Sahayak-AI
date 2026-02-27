import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Note: Install react-native-camera or use react-native-vision-camera
// For now, using a placeholder implementation
const RNCamera: any = {
  Constants: {
    Type: {
      back: 'back',
      front: 'front'
    }
  }
};

export default function CameraScreen({ navigation }: any) {
  const cameraRef = useRef<RNCamera>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const takePicture = async () => {
    // Placeholder - implement with react-native-vision-camera or expo-camera
    Alert.alert('Camera', 'Camera functionality requires native camera library installation');
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const usePhoto = () => {
    // Upload photo logic here
    navigation.goBack();
  };

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={retake}>
            <Icon name="refresh" size={30} color="#fff" />
            <Text style={styles.actionText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={usePhoto}>
            <Icon name="check" size={30} color="#fff" />
            <Text style={styles.actionText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <View style={styles.overlay}>
          <Text style={styles.instruction}>Position document within frame</Text>
          <Text style={styles.note}>
            Note: Install react-native-vision-camera for full camera functionality
          </Text>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  instruction: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  note: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  controls: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
});
