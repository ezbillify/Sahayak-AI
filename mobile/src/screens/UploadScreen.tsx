import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';

export default function UploadScreen({ navigation }: any) {
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const openCamera = () => {
    navigation.navigate('Camera');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      setResult({
        documentType: 'GST Registration Form',
        summary: 'This is a GST registration application form for new businesses. It requires basic business information, owner details, and bank account information.',
        keyInformation: [
          'Business Name and Address',
          'PAN Number',
          'Bank Account Details',
          'Business Activity Type'
        ],
        requiredActions: [
          'Fill all mandatory fields marked with *',
          'Attach PAN card copy',
          'Attach address proof',
          'Submit within 30 days of business commencement'
        ]
      });
      setUploading(false);
    }, 2000);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
  };

  if (result) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Analysis Results</Text>

          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Document Type</Text>
            <Text style={styles.resultText}>{result.documentType}</Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Summary</Text>
            <Text style={styles.resultText}>{result.summary}</Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Key Information Required</Text>
            {result.keyInformation.map((info: string, i: number) => (
              <View key={i} style={styles.listItem}>
                <Icon name="check-circle" size={16} color="#10b981" />
                <Text style={styles.listText}>{info}</Text>
              </View>
            ))}
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.resultLabel}>Required Actions</Text>
            {result.requiredActions.map((action: string, i: number) => (
              <View key={i} style={styles.listItem}>
                <Icon name="arrow-forward" size={16} color="#2563eb" />
                <Text style={styles.listText}>{action}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.buttonText}>Upload Another Document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.uploadArea}>
          <Icon name="cloud-upload" size={80} color="#9ca3af" />
          <Text style={styles.uploadTitle}>Upload Government Document</Text>
          <Text style={styles.uploadSubtitle}>
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </Text>

          <View style={styles.uploadButtons}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Icon name="folder-open" size={24} color="#2563eb" />
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
              <Icon name="camera-alt" size={24} color="#2563eb" />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {file && (
            <View style={styles.fileInfo}>
              <Icon name="insert-drive-file" size={24} color="#2563eb" />
              <Text style={styles.fileName}>{file.name}</Text>
            </View>
          )}
        </View>

        {file && !result && (
          <TouchableOpacity
            style={[styles.button, uploading && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>
              {uploading ? 'Processing...' : 'Upload and Analyze'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  uploadArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  fileName: {
    fontSize: 14,
    color: '#374151',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});
