import 'package:flutter/material.dart';

class EventMembersTable extends StatelessWidget {
  final List<Map<String, String>>? members;
  final bool isLoading;

  const EventMembersTable({super.key, this.members, this.isLoading = false});

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (members == null || members!.isEmpty) {
      return const Center(child: Text('No members found'));
    }

    return DataTable(
      columns: const [
        DataColumn(label: Text('Name')),
        DataColumn(label: Text('Year')),
        DataColumn(label: Text('Department')),
        DataColumn(label: Text('Section')),
      ],
      rows:
          members!
              .map(
                (member) => DataRow(
                  cells: [
                    DataCell(Text(member['name']!)),
                    DataCell(Text(member['year']!)),
                    DataCell(Text(member['department']!)),
                    DataCell(Text(member['section']!)),
                  ],
                ),
              )
              .toList(),
    );
  }
}
