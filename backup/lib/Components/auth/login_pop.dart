import 'package:flutter/material.dart';

class AuthPopup extends StatefulWidget {
  const AuthPopup({Key? key}) : super(key: key);

  @override
  State<AuthPopup> createState() => _AuthPopupState();
}

class _AuthPopupState extends State<AuthPopup> {
  final _registerNumberController = TextEditingController();
  final _passwordController = TextEditingController();

  void _submit() {
    Navigator.pop(context, {
      'registerNumber': _registerNumberController.text,
      'password': _passwordController.text,
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: SingleChildScrollView(
          child: AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTextField(
                  'Register Number',
                  _registerNumberController,
                ),
                _buildTextField(
                  'Password',
                  _passwordController,
                  obscureText: true,
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildButton(
                      'Cancel',
                      Colors.black26,
                      () => Navigator.pop(context),
                    ),
                    _buildButton(
                      'Login',
                      Colors.red,
                      _submit,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    bool obscureText = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
    );
  }

  Widget _buildButton(String text, Color color, VoidCallback onPressed) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      onPressed: onPressed,
      child: Text(
        text,
        style: const TextStyle(color: Colors.white),
      ),
    );
  }
}

Future<Map<String, String>?> showAuthPopup(BuildContext context) async {
  return await showDialog<Map<String, String>>(
    context: context,
    builder: (context) => const AuthPopup(),
  );
}
