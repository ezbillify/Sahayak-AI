import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DashboardScreen({ navigation }: any) {
  const deadlines = [
    { id: 1, title: 'GST Return Filing', type: 'GST', dueDate: '2024-03-20', priority: 'high' },
    { id: 2, title: 'PAN-Aadhaar Linking', type: 'PAN', dueDate: '2024-03-25', priority: 'medium' },
    { id: 3, title: 'Trade License Renewal', type: 'License', dueDate: '2024-04-10', priority: 'low' },
  ];

  const recentDocuments = [
    { id: 1, name: 'GST Certificate.pdf', uploadDate: '2024-02-20', status: 'processed' },
    { id: 2, name: 'PAN Card.jpg', uploadDate: '2024-02-18', status: 'processed' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={styles.stats}>
        <View style={[styles.statCard, { backgroundColor: '#eff6ff', borderLeftColor: '#2563eb' }]}>
          <Text style={styles.statLabel}>Upcoming Deadlines</Text>
          <Text style={[styles.statValue, { color: '#2563eb' }]}>{deadlines.length}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#f0fdf4', borderLeftColor: '#10b981' }]}>
          <Text style={styles.statLabel}>Documents Processed</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{recentDocuments.length}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#fef3c7', borderLeftColor: '#f59e0b' }]}>
          <Text style={styles.statLabel}>Pending Actions</Text>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>1</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        {deadlines.map((deadline) => (
          <View key={deadline.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{deadline.title}</Text>
              <Text style={styles.cardSubtitle}>{deadline.type} • Due: {deadline.dueDate}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getPriorityColor(deadline.priority) }]}>
              <Text style={styles.badgeText}>{deadline.priority}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Compliance')}
        >
          <Text style={styles.buttonText}>View All Compliance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Documents</Text>
        {recentDocuments.map((doc) => (
          <View key={doc.id} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{doc.name}</Text>
              <Text style={styles.cardSubtitle}>Uploaded: {doc.uploadDate}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#10b981' }]}>
              <Text style={styles.badgeText}>{doc.status}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Upload')}
        >
          <Text style={styles.buttonText}>Upload New Document</Text>
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  stats: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
