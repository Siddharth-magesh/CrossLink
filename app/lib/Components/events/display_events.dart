/// A stateless widget that displays a list of event cards.
///
/// This widget builds a page with a list of events, each represented by a card.
/// The events are passed as a list of maps containing event details such as
/// name, dateTime, location, and status. When an event card is tapped, it
/// navigates to the `DisplayEventDetails` page, passing the event details.
///
/// The `EventCardsPage` widget uses a `SafeArea` to avoid system UI intrusions,
/// a `Scaffold` to provide the basic material design visual layout structure,
/// and a `ListView.builder` to efficiently create the list of event cards.
import 'package:flutter/material.dart';
import 'event_details.dart';

class EventCardsPage extends StatelessWidget {
  final List<Map<String, String>> events = [
    {
      'name': 'Blood Donation Camp',
      'dateTime': 'March 15, 2025 - 10:00 AM',
      'location': 'Community Hall', // Added location
      'status': 'Ongoing',
    },
    {
      'name': 'First Aid Workshop',
      'dateTime': 'March 20, 2025 - 2:00 PM',
      'location': 'Auditorium', // Added location
      'status': 'Upcoming',
    },
  ];

  EventCardsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Events'),
          actions: [
            IconButton(icon: const Icon(Icons.filter_list), onPressed: () {}),
          ],
        ),
        body: LayoutBuilder(
          builder: (context, constraints) {
            return ListView.builder(
              itemCount: events.length,
              itemBuilder: (context, index) {
                final event = events[index];
                return GestureDetector(
                  // Make the whole card tappable
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => DisplayEventDetails(event: event),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: Card(
                      color: Colors.red,
                      elevation: 10.0,
                      shadowColor: Colors.black.withOpacity(0.5),
                      margin: const EdgeInsets.symmetric(vertical: 8.0),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          vertical: 8.0,
                          horizontal: 16.0,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              event['name']!,
                              style: const TextStyle(
                                fontSize: 26.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              event['dateTime']!,
                              style: const TextStyle(
                                fontSize: 16.0,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Status: ${event['status']}',
                              style: const TextStyle(
                                fontSize: 16.0,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
