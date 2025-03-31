import 'package:flutter/material.dart';
import '../../config.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            children: [
              TextSpan(text: "Cross", style: TextStyle(color: Colors.red)),
              TextSpan(text: "Link", style: TextStyle(color: Colors.white)),
            ],
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildTile(context, "Events", Icons.event, Colors.blueAccent),
            SizedBox(height: 20),
            _buildTile(context, "On Duty", Icons.work, Colors.orangeAccent),
            SizedBox(height: 20),
            _buildTile(context, "Memo", Icons.note, Colors.greenAccent),
          ],
        ),
      ),
    );
  }

  Widget _buildTile(
      BuildContext context, String title, IconData icon, Color color) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          padding: EdgeInsets.symmetric(vertical: 16),
          backgroundColor: color,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        onPressed: () {
          // Add navigation logic for each button
        },
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white),
            SizedBox(width: 10),
            Text(
              title,
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
