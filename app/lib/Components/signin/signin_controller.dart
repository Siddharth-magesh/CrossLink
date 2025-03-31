import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../config.dart';

class SignInController {
  static Future<bool> login(String regNo, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/login'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"registration_number": regNo, "password": password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setBool('isLoggedIn', true);
        await prefs.setString('authToken', data['token']);

        return true;
      } else {
        print("Login failed: ${response.body}");
        return false;
      }
    } catch (e) {
      print("Login error: $e");
      return false;
    }
  }
}
