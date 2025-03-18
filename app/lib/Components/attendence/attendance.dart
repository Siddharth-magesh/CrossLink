import 'package:flutter/material.dart';
import '../utils/buttons.dart';
import '../events/event_creation.dart';
import '../events/display_events.dart';

class AttendancePage extends StatefulWidget {
  const AttendancePage({super.key});

  @override
  State<AttendancePage> createState() => _AttendancePageState();
}

class _AttendancePageState extends State<AttendancePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Attendance Management')),
      body: SafeArea(
        child: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              eventsButton(() {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => EventCardsPage()),
                );
              }),
              createEventButton(() {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const EventCreationPage(),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}

void main() {
  runApp(const MaterialApp(home: AttendancePage()));
}
