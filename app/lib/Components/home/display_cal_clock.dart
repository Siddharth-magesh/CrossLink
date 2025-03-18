// display_cal_clock.dart
import 'package:flutter/material.dart';

// Function to select a time using a time picker dialog
Future<void> selectTime(
  BuildContext context,
  TextEditingController timeController,
) async {
  // Show the time picker dialog and wait for the user's selection
  final TimeOfDay? picked = await showTimePicker(
    context: context,
    initialTime: TimeOfDay.now(), // Set the initial time to the current time
  );
  // If the user picked a time and the context is still valid
  if (picked != null && context.mounted) {
    // Format the picked time and set it to the timeController's text
    timeController.text = picked.format(context);
  }
}

// Function to select a date using a date picker dialog
Future<void> selectDate(
  BuildContext context,
  TextEditingController dateController,
) async {
  // Show the date picker dialog and wait for the user's selection
  final DateTime? picked = await showDatePicker(
    context: context,
    initialDate: DateTime.now(), // Set the initial date to the current date
    firstDate: DateTime(2000), // Set the earliest date the user can pick
    lastDate: DateTime(2101), // Set the latest date the user can pick
  );
  // If the user picked a date and the context is still valid
  if (picked != null && context.mounted) {
    // Format the picked date and set it to the dateController's text
    dateController.text = picked.toLocal().toString().split(' ')[0];
  }
}
