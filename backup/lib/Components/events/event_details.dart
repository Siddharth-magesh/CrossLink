/// A StatefulWidget that displays the details of an event.
///
/// This widget fetches and displays the details of an event, including its
/// name, date, location, and a list of members associated with the event.
/// It also provides options to edit the event details and scan a QR code.
///
/// The [DisplayEventDetails] widget requires an [event] map containing the
/// event details.
///
/// Example usage:
/// ```dart
/// DisplayEventDetails(event: {
///   'name': 'Event Name',
///   'dateTime': 'Event Date and Time',
///   'location': 'Event Location',
/// });
/// ```
///
/// The [event] map should contain the following keys:
/// - 'name': The name of the event.
/// - 'dateTime': The date and time of the event.
/// - 'location': The location of the event (optional).
///
/// The widget fetches the event members from a MongoDB database and displays
/// them in a table. It handles loading and error states while fetching the
/// members.
///
/// The widget also provides a floating action button to scan a QR code and an
/// app bar button to edit the event details.
import 'package:flutter/material.dart'
    show
        AppBar,
        BuildContext,
        Center,
        CircularProgressIndicator,
        Colors,
        Column,
        CrossAxisAlignment,
        EdgeInsets,
        Expanded,
        FloatingActionButton,
        FloatingActionButtonLocation,
        FontWeight,
        Icon,
        IconButton,
        Icons,
        MaterialPageRoute,
        Navigator,
        Padding,
        SafeArea,
        Scaffold,
        SizedBox,
        State,
        StatefulWidget,
        Text,
        TextStyle,
        Widget;
import 'package:mongo_dart/mongo_dart.dart' as mongo;
import 'event_members.dart';
import 'event_creation.dart';

class DisplayEventDetails extends StatefulWidget {
  final Map<String, String> event;

  const DisplayEventDetails({super.key, required this.event});

  @override
  State<DisplayEventDetails> createState() => _DisplayEventDetailsState();
}

class _DisplayEventDetailsState extends State<DisplayEventDetails> {
  List<Map<String, String>> members = []; // List to store event members
  bool isLoading = true; // Flag to indicate loading state
  bool hasError = false; // Flag to indicate error state

  @override
  void initState() {
    super.initState();
    fetchEventMembers(); // Fetch event members when the widget is initialized
  }

  Future<void> fetchEventMembers() async {
    try {
      var db = await mongo.Db.create(
        'mongodb://localhost:27017/your_database',
      ); // Connect to MongoDB
      await db.open(); // Open the database connection
      var collection = db.collection(
        'event_members',
      ); // Get the event_members collection

      var result =
          await collection.find({
            'eventName': widget.event['name'],
          }).toList(); // Fetch members for the event

      setState(() {
        members =
            result.map((member) {
              return {
                'name': member['name'].toString(),
                'year': member['year'].toString(),
                'department': member['department'].toString(),
                'section': member['section'].toString(),
              };
            }).toList(); // Map the result to the members list
        isLoading = false; // Set loading to false
      });

      await db.close(); // Close the database connection
    } catch (e) {
      setState(() {
        isLoading = false; // Set loading to false
        hasError = true; // Set error to true
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            'Event Details',
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const EventCreationPage(),
                  ),
                );
              },
            ),
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.event['name']!,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.event['dateTime']!,
                style: const TextStyle(fontSize: 18, color: Colors.grey),
              ),
              const SizedBox(height: 8),
              if (widget.event['location'] != null)
                Text(
                  widget.event['location']!,
                  style: const TextStyle(fontSize: 18),
                ),
              const SizedBox(height: 16),

              // Event members table with loading and error states
              Expanded(
                child:
                    isLoading
                        ? const Center(
                          child: CircularProgressIndicator(),
                        ) // Show loading indicator
                        : hasError
                        ? const Center(
                          child: Text('Failed to load members'),
                        ) // Show error message
                        : members.isEmpty
                        ? const Center(
                          child: Text('No members found'),
                        ) // Show no members message
                        : EventMembersTable(
                          members: members,
                        ), // Show members table
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            // Add QR code scanner functionality here
          },
          backgroundColor: Colors.red,
          child: const Icon(Icons.qr_code_scanner, color: Colors.white),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      ),
    );
  }
}
