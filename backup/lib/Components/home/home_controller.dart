import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/material.dart';
import '../auth/login_pop.dart';
import '../utils/config.dart';

class HomeController {
  static Future<bool> checkLoginStatus(
      BuildContext context, String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/login'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": username,
          "password": password,
        }),
      );
      if (response.statusCode == 200) {
        return true;
      } else {
        _redirectToLogin(context);
        return false;
      }
    } catch (e) {
      debugPrint("Login API Error: $e");
      _redirectToLogin(context);
      return false;
    }
  }

  static void _redirectToLogin(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showAuthPopup(context);
    });
  }

  static Future<Map<String, String>> fetchUserDetails(String username) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/fetch_admin_profile'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"username": username}),
      );

      if (response.statusCode == 200) {
        var userData = jsonDecode(response.body);

        return {
          'username': userData['name'] ?? '',
          'email': userData['email'] ?? '',
        };
      } else {
        debugPrint(
            "Failed to fetch user details. Status: ${response.statusCode}");
        return {
          'name': 'Username',
          'email': 'mailId@gmail.com',
        };
      }
    } catch (e) {
      debugPrint("Fetch User Details API Error: $e");
      return {
        'name': 'Username',
        'email': 'mailId@gmail.com',
      };
    }
  }
}
