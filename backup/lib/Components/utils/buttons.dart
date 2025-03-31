import 'package:flutter/material.dart';

// Attendance Button
Widget attendanceButton(VoidCallback onPressed) {
  return _buildButton(onPressed, Icons.how_to_reg_outlined, 'Attendance');
}

// Memo Button
Widget downloadButton(VoidCallback onPressed) {
  return _buildButton(onPressed, Icons.edit_note_outlined, 'Memo');
}

// On-Duty Button
Widget viewButton(VoidCallback onPressed) {
  return _buildButton(onPressed, Icons.pending_actions_outlined, 'On-Duty');
}

// Events Button
Widget eventsButton(VoidCallback onPressed) {
  return _buildButton(onPressed, Icons.event, 'Events');
}

// Create Event Button
Widget createEventButton(VoidCallback onPressed) {
  return _buildButton(onPressed, Icons.add_circle_outline, 'Create Event');
}

// Reusable Button Widget
Widget _buildButton(VoidCallback onPressed, IconData icon, String label) {
  return Expanded(
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SizedBox(height: 50),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red[700],
              padding: EdgeInsets.all(20),
              minimumSize: Size(double.infinity, 70),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: onPressed,
            child: Icon(icon, size: 45, color: Colors.white),
          ),
          SizedBox(height: 8),
          Text(label, style: TextStyle(fontSize: 15, color: Colors.white), textAlign: TextAlign.center),
        ],
      ),
    ),
  );
}