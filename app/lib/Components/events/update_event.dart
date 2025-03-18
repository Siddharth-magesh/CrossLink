 import 'package:mongo_dart/mongo_dart.dart' as mongo;

Future<void> updateEvent(
  String eventId,
  Map<String, dynamic> updatedData,
) async {
  try {
    var db = await mongo.Db.create('mongodb://your-mongo-url');
    await db.open();

    var collection = db.collection('events');

    var result = await collection.updateOne(
      mongo.where.eq('_id', mongo.ObjectId.parse(eventId)),
      mongo.modify
          .set('name', updatedData['name'])
          .set('date', updatedData['date'])
          .set('startTime', updatedData['startTime'])
          .set('endTime', updatedData['endTime'])
          .set('location', updatedData['location'])
          .set('mapUrl', updatedData['mapUrl']),
    );

    if (result.isSuccess) {
    } else {}
    await db.close();
  } catch (e) {}
}
