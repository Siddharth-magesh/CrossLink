import 'package:flutter/material.dart';
import 'dart:async';

class LandingPage extends StatefulWidget {
  @override
  _LandingPageState createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  double _progress = 0.0;

  @override
  void initState() {
    super.initState();
    _startLoading();
  }

  void _startLoading() {
    Timer.periodic(Duration(milliseconds: 100), (timer) {
      setState(() {
        _progress += 0.1;
        if (_progress >= 1.0) {
          timer.cancel();
          // Navigate to next screen (replace with actual navigation)
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            RichText(
              text: TextSpan(
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                children: [
                  TextSpan(text: "Cross", style: TextStyle(color: Colors.red)),
                  TextSpan(text: "Link", style: TextStyle(color: Colors.white)),
                ],
              ),
            ),
            SizedBox(height: 20),
            LinearProgressIndicator(
              value: _progress,
              minHeight: 3,
              backgroundColor: Colors.grey[800],
              valueColor: AlwaysStoppedAnimation<Color>(Colors.red),
            ),
          ],
        ),
      ),
    );
  }
}
