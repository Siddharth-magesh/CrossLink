import 'package:flutter/material.dart';
import 'Components/home/home.dart';

void main() {
  runApp(const CrossLink());
}

class CrossLink extends StatelessWidget {
  const CrossLink({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF121212),
        scaffoldBackgroundColor: const Color(0xFF121212),
        appBarTheme: const AppBarTheme(backgroundColor: Color(0xFF1C1C1C)),
        drawerTheme: const DrawerThemeData(backgroundColor: Color(0xFF1C1C1C)),
      ),
      home: const HomePage(),
    );
  }
}
