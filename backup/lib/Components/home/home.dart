import 'package:flutter/material.dart';
import '../utils/buttons.dart';
import '../attendence/attendance.dart';
import '../profile/profile.dart';
import '../auth/login_pop.dart';
import 'home_controller.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String username = '';
  String email = '';
  String password = '';
  String profileImage = 'test.jpg';
  bool isAuthenticated = false;
  bool isCheckingAuth = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, checkLogin);
  }

  Future<void> checkLogin() async {
    if (isCheckingAuth) return;
    isCheckingAuth = true;

    var result = await showAuthPopup(context);
    if (result != null) {
      setState(() {
        username = result['registerNumber'] ?? '';
        password = result['password'] ?? '';
      });
      authenticateUser();
    } else {
      isCheckingAuth = false;
    }
  }

  Future<void> authenticateUser() async {
    bool loggedIn =
        await HomeController.checkLoginStatus(context, username, password);
    if (loggedIn) {
      var userDetails = await HomeController.fetchUserDetails(username);
      setState(() {
        username = userDetails['username'] ?? '';
        email = userDetails['email'] ?? '';
        isAuthenticated = true;
      });
    } else {
      setState(() {
        isAuthenticated = false;
      });
      Future.delayed(Duration.zero, checkLogin);
    }
    isCheckingAuth = false;
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: InkWell(
            onTap: isAuthenticated
                ? () {
                    print("Profile clicked");
                  }
                : null,
            child: Container(
              width: double.infinity,
              color: Colors.black12,
              child: ProfileAppBar(
                username: username,
                email: email,
                profileImage: profileImage,
              ),
            ),
          ),
        ),
        body: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              attendanceButton(() {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AttendancePage(),
                  ),
                );
              }),
              downloadButton(() => {}),
              viewButton(() => {}),
            ],
          ),
        ),
      ),
    );
  }
}
