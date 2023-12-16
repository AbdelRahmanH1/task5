const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "task5-sef";
const collectionName = "users";

const users = [
  {
    name: "Jhon",
    age: 27,
  },
  {
    name: "Alia",
    age: 27,
  },
  {
    name: "Samir",
    age: 27,
  },
  {
    name: "Abdel Rahman",
    age: 27,
  },
  {
    name: "Ziad",
    age: 27,
  },
  {
    name: "Mariam",
    age: 22,
  },
  {
    name: "Mego",
    age: 21,
  },
  {
    name: "Basel",
    age: 19,
  },
  {
    name: "Sakr",
    age: 22,
  },
  {
    name: "Gasser",
    age: 23,
  },
];

const connectToDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const insertOne = async (document) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne(document);
    console.log("Done insert One");
  } catch (error) {
    console.log("error: cant insertOne");
  }
};

const insertMany = async (documents) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertMany(documents);
    console.log("Done insert Many");
  } catch (error) {
    console.log("error: cant many users");
  }
};

const findUsersByAge = async () => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = { age: 27 };

    const result = await collection.find(query, { _id: 0 }).toArray();

    console.log(`Users with age 27y:`, result);
  } catch (error) {
    console.error("Error finding users:", error);
  }
};

const findUsersByAgeLimit = async () => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const query = { age: 27 };

    const result = await collection.find(query).limit(3).toArray();

    console.log(`the first 3 Users with age 27y:`, result);
  } catch (error) {
    console.error("Error finding users:", error);
  }
};

const updateNameForFirstFourUser = async (updatedName) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const update = { $set: { name: updatedName } };

    const documentsToUpdate = await collection.find().limit(4).toArray();

    let arr = [];

    for (const document of documentsToUpdate) {
      await collection.updateOne({ _id: document._id }, update);

      arr.push({ name: updatedName, age: document.age });
    }
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

const incFourDocument = async () => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const documentsToUpdate = await collection.find({}).limit(4).toArray();

    for (const document of documentsToUpdate) {
      const result = await collection.updateOne(
        { _id: document._id },
        { $inc: { age: 10 } }
      );

      const updatedDocument = await collection.findOne(
        { _id: document._id },
        { _id: 0 }
      );
      console.log(`Updated first 4 document:`, updatedDocument);

      console.log(
        `Updated document with _id ${document._id}. Matched ${result.matchedCount}. Modified ${result.modifiedCount}.`
      );
    }

    console.log(`Incremented 'age' in the first four documents.`);
  } catch (error) {
    console.error("Error incrementing 'age':", error);
  }
};

const incremmeantAll = async () => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const update = { $inc: { age: 10 } };

    const result = await collection.updateMany({}, update);

    console.log(
      `Incremented 'age' for all documents. Matched ${result.matchedCount} document(s). Modified ${result.modifiedCount} document(s).`
    );
  } catch (error) {
    console.error("Error incrementing 'age':", error);
  }
};

const deleteUserByAge = async () => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const query = { age: 41 };
    const result = await collection.deleteMany(query);
    console.log(`Deleted ${result.deletedCount} document(s) with age ${41}.`);
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};

const execute = async () => {
  await connectToDB();
  console.log("==========================");
  await insertOne({ name: "Ahmed", age: 20 });
  console.log("==========================");
  await insertOne({ name: "Yasser", age: 21 });
  console.log("==========================");
  await insertMany(users);
  console.log("==========================");
  await findUsersByAge();
  console.log("==========================");
  await findUsersByAgeLimit();
  console.log("==========================");
  await updateNameForFirstFourUser("updatedName");
  console.log("==========================");
  await incFourDocument();
  console.log("==========================");
  await incremmeantAll();
  console.log("==========================");
  await deleteUserByAge();
  console.log("==========================");

  await client.close();
};
execute();
