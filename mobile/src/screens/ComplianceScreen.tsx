import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ComplianceScreen() {
  const [deadlines] = useState([
    {
      id: '1',
      title: 'GST Return Filing - GSTR-3B',
      type: 'GST',
      description: 'Monthly GST return filing',
      dueDate: '2024-03-20',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      title: 'PAN-Aadhaar Linking',
      type: 'PAN',
      description: 'Link PAN with Aadhaar',
      dueDate: '2024-03-25',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Trade License Renewal',
      type: 'License',
      description: 'Renew trade license',
      dueDate: '2024-04-10',
      priority: 'low',
      status: 'pending'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GST': return '#2563eb';
      case 'PAN': return '#06b6d4';
      case 'License': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDaysLeft = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compliance Tracking</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {deadlines.map((deadline) => (
          <View key={deadline.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: getTypeColor(deadline.type) }]}>
                  <Text style={styles.badgeText}>{deadline.type}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getPriorityColor(deadline.priority) }]}>
                  <Text style={styles.badgeText}>{deadline.priority}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.cardTitle}>{deadline.title}</Text>
            <Text style={styles.cardDescription}>{deadline.description}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.dateInfo}>
                <Icon name="event" size={16} color="#6b7280" />
                <Text style={styles.dateText}>Due: {deadline.dueDate}</Text>
              </View>
              <View style={styles.dateInfo}>
                <Icon name="alarm" size={16} color="#6b7280" />
                <Text style={styles.dateText}>{getDaysLeft(deadline.dueDate)} days left</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                  Mark Complete
                </Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
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
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  actionButtonTextPrimary: {
    color: '#fff',
  },
});
