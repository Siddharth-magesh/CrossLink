import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/config.dart';

class EventController {
  static Future<bool> createEvent(Map<String, dynamic> eventData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/add_event'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(eventData),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print("Failed to create event: ${response.statusCode}");
        return false;
      }
    } catch (e) {
      print("Event creation error: $e");
      return false;
    }
  }
}
