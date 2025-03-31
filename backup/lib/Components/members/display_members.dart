import 'package:flutter/material.dart';
import 'package:mongo_dart/mongo_dart.dart' as mongo;
import 'filter_members.dart';

class DisplayMembersPage extends StatefulWidget {
  const DisplayMembersPage({super.key});

  @override
  State<DisplayMembersPage> createState() => _DisplayMembersPageState();
}

class _DisplayMembersPageState extends State<DisplayMembersPage> {
  final TextEditingController _searchController = TextEditingController();
  List<Map<String, String>> members = [];
  List<Map<String, String>> filteredMembers = [];
  Map<String, bool> selectedMembers = {};
  Map<String, Set<String>> activeFilters = {};
  bool isSelectMode = false;

  @override
  void initState() {
    super.initState();
    _fetchMembers();
    _searchController.addListener(() => _applyFilters(activeFilters));
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchMembers() async {
    try {
      var db = await mongo.Db.create('mongodb://localhost:27017/your_database');
      await db.open();
      var collection = db.collection('members');
      var data =
      await collection
          .find()
          .map((member) => member.cast<String, String>())
          .toList();
      setState(() {
        members = data;
        filteredMembers = members;
      });
      await db.close();
    } catch (e) {}
  }

  void _applyFilters(Map<String, Set<String>> filters) {
    setState(() {
      activeFilters = filters;
      filteredMembers = FilterMembers.applyFilters(
        members,
        activeFilters,
        _searchController.text,
      );
    });
  }

  void _toggleSelectMode() {
    setState(() {
      isSelectMode = !isSelectMode;
      if (!isSelectMode) {
        selectedMembers.clear();
      }
    });
  }

  void _clearAllSelections() {
    setState(() {
      selectedMembers.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Members')),
      body: Column(
        children: [
          _buildSearchBar(context),
          _buildSelectButtonRow(),
          _buildDataTable(),
        ],
      ),
      bottomNavigationBar: _buildActionButtons(context),
    );
  }

  Widget _buildSearchBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          labelText: 'Search',
          border: const OutlineInputBorder(),
          suffixIcon: GestureDetector(
            onTapDown:
                (details) =>
                FilterMembers.showFilterMenu(
                  context,
                  details.globalPosition,
                  activeFilters,
                  _applyFilters,
                ),
            child: const Icon(Icons.filter_list),
          ),
        ),
      ),
    );
  }

  Widget _buildSelectButtonRow() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ElevatedButton(
            onPressed: _toggleSelectMode,
            child: Text(isSelectMode ? 'Done' : 'Select'),
          ),
          if (isSelectMode)
            TextButton(
              onPressed: _clearAllSelections,
              child: const Text('Clear All'),
            ),
        ],
      ),
    );
  }

  Widget _buildDataTable() {
    return Expanded(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columnSpacing: 20.0,
          columns: [
            if (isSelectMode)
              const DataColumn(
                label: Text(
                  'Select',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            const DataColumn(
              label: Text(
                'Name',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const DataColumn(
              label: Text(
                'Year',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const DataColumn(
              label: Text(
                'Department',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const DataColumn(
              label: Text(
                'Section',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const DataColumn(
              label: Text(
                'yrcId',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
          rows: filteredMembers.map((member) => _buildDataRow(member)).toList(),
        ),
      ),
    );
  }

  DataRow _buildDataRow(Map<String, dynamic> member) {
    final memberKey = member['name'] ?? '';
    return DataRow(
      cells: [
        if (isSelectMode)
          DataCell(
            Checkbox(
              value: selectedMembers[memberKey] ?? false,
              onChanged:
                  (value) =>
                  setState(
                        () => selectedMembers[memberKey] = value ?? false,
                  ),
            ),
          ),
        DataCell(Text(member['name'] ?? '')),
        DataCell(Text(member['year'] ?? '')),
        DataCell(Text(member['department'] ?? '')),
        DataCell(Text(member['section'] ?? '')),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        color: Colors.black,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Members added successfully!'),
                    backgroundColor: Colors.green,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
                Navigator.pop(context);
              },
              child: const Text('Update'),
            ),
          ],
        ),
      ),
    );
  }
}