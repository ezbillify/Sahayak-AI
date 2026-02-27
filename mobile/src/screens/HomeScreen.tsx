import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sahayak AI</Text>
        <Text style={styles.subtitle}>
          Simplify Government Paperwork with AI
        </Text>
        <Text style={styles.description}>
          Upload documents, get instant explanations in your language, fill forms correctly, 
          and never miss a compliance deadline.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Icon name="description" size={40} color="#2563eb" />
          <Text style={styles.featureTitle}>Document Analysis</Text>
          <Text style={styles.featureText}>
            Upload PDFs or images. Our AI extracts text and explains everything in simple language.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Icon name="edit-note" size={40} color="#2563eb" />
          <Text style={styles.featureTitle}>Form Assistance</Text>
          <Text style={styles.featureText}>
            Get step-by-step guidance for GST, PAN, licenses, and tax forms with auto-fill.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Icon name="alarm" size={40} color="#2563eb" />
          <Text style={styles.featureTitle}>Deadline Tracking</Text>
          <Text style={styles.featureText}>
            Never miss a compliance deadline. Get reminders 30, 7, and 1 day before.
          </Text>
        </View>
      </View>

      <View style={styles.services}>
        <Text style={styles.servicesTitle}>Supported Services</Text>
        {[
          'GST Registration & Returns',
          'PAN Card Services',
          'Business Licenses',
          'Income Tax Filing',
          'Aadhaar Linking',
          'Trade Licenses'
        ].map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  buttons: {
    padding: 24,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    padding: 24,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  services: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  servicesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  serviceText: {
    fontSize: 16,
    color: '#374151',
  },
});
