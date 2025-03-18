import 'package:flutter/material.dart';

class FilterMembers {
  static List<Map<String, String>> applyFilters(List<Map<String, String>> members, Map<String, Set<String>> activeFilters, String searchQuery) {
    var filtered = members.where((member) {
      for (var key in activeFilters.keys) {
        if (activeFilters[key]!.isNotEmpty && !activeFilters[key]!.contains(member[key])) {
          return false;
        }
      }
      if (searchQuery.isNotEmpty && !member['name']!.toLowerCase().contains(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    }).toList();

    filtered.sort((a, b) => a['name']!.compareTo(b['name']!)); // Always sort by name in ascending order
    return filtered;
  }

  static void showFilterMenu(BuildContext context, Offset position, Map<String, Set<String>> activeFilters, Function(Map<String, Set<String>>) applyFilters) {
    showMenu(
      context: context,
      position: RelativeRect.fromLTRB(position.dx, position.dy, position.dx + 1, position.dy + 1),
      items: [
        PopupMenuItem(
          child: const Text('Clear All Filters'),
          onTap: () {
            activeFilters.clear();
            applyFilters(activeFilters);
          },
        ),
        _buildSubMenu(context, position, 'Year', ['I', 'II', 'III', 'IV'], activeFilters, applyFilters),
        _buildSubMenu(context, position, 'Department', ['CSE', 'ECE', 'MECH'], activeFilters, applyFilters),
        _buildSubMenu(context, position, 'Section', ['A', 'B', 'C', 'D', 'E'], activeFilters, applyFilters),
      ],
    );
  }

  static PopupMenuItem _buildSubMenu(BuildContext context, Offset position, String title, List<String> options, Map<String, Set<String>> activeFilters, Function(Map<String, Set<String>>) applyFilters) {
    return PopupMenuItem(
      child: Text(title),
      onTap: () {
        Future.delayed(Duration.zero, () => showMenu(
          context: context,
          position: RelativeRect.fromLTRB(position.dx + 150, position.dy, position.dx + 151, position.dy + 1),
          items: options.map((option) => PopupMenuItem(
            child: StatefulBuilder(
              builder: (context, setState) => Row(
                children: [
                  Checkbox(
                    value: activeFilters[title.toLowerCase()]?.contains(option) ?? false,
                    onChanged: (selected) {
                      setState(() {
                        if (selected == true) {
                          activeFilters.putIfAbsent(title.toLowerCase(), () => {}).add(option);
                        } else {
                          activeFilters[title.toLowerCase()]?.remove(option);
                        }
                      });
                      applyFilters(activeFilters);
                    },
                  ),
                  Text(option),
                ],
              ),
            ),
          )).toList(),
        ));
      },
    );
  }
}
