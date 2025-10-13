//#include "pch.h"
#include "CppUnitTest.h"
#include "../../include/communication/Message.h"
#include "../../include/communication/Conversation.h"
#include "../../include/communication/CommunicationHub.h"
#include "../../include/persistence/FileRepository.h"
#include <vector>
#include <string>

using namespace Microsoft::VisualStudio::CppUnitTestFramework;
using namespace std;

namespace CommunicationTests
{
	TEST_CLASS(MessageTests)
	{
	public:
		
		TEST_METHOD(TestCase1_MessageDefaultConstructor)
		{
			Message msg;

			Assert::AreEqual(0, msg.getId());
			Assert::AreEqual(0, msg.getSenderId());
			Assert::AreEqual(string(""), msg.getBody());
			Assert::AreEqual(string(""), msg.getTime());
			Assert::IsFalse(msg.getIsRead());
		}

		TEST_METHOD(TestCase2_MessageParameterizedConstructor)
		{
			Message msg(1, 101, "Hello World", "2024-01-15 10:30:00");

			Assert::AreEqual(1, msg.getId());
			Assert::AreEqual(101, msg.getSenderId());
			Assert::AreEqual(string("Hello World"), msg.getBody());
			Assert::AreEqual(string("2024-01-15 10:30:00"), msg.getTime());
			Assert::IsFalse(msg.getIsRead());
		}

		TEST_METHOD(TestCase3_MessageSetters)
		{
			Message msg;
			
			msg.SetId(5);
			msg.SetSenderId(202);
			msg.SetBody("Test message");
			msg.SetTime("2024-02-20 14:45:00");

			Assert::AreEqual(5, msg.getId());
			Assert::AreEqual(202, msg.getSenderId());
			Assert::AreEqual(string("Test message"), msg.getBody());
			Assert::AreEqual(string("2024-02-20 14:45:00"), msg.getTime());
		}

		TEST_METHOD(TestCase4_MessageMarkAsRead)
		{
			Message msg(1, 101, "Test", "2024-01-01 12:00:00");
			
			Assert::IsFalse(msg.getIsRead());
			
			msg.MarkRead();
			
			Assert::IsTrue(msg.getIsRead());
		}

		TEST_METHOD(TestCase5_MessageSerialization)
		{
			Message msg(10, 505, "Important message", "2024-03-10 16:20:00");
			msg.MarkRead();

			string serialized = msg.serialize();
			
			Assert::AreEqual(string("10|505|Important message|2024-03-10 16:20:00|1"), serialized);
		}

		TEST_METHOD(TestCase6_MessageDeserialization)
		{
			string serializedData = "25|303|Testing deserialization|2024-04-05 09:15:00|0";
			
			Message msg = Message::deserialize(serializedData);

			Assert::AreEqual(25, msg.getId());
			Assert::AreEqual(303, msg.getSenderId());
			Assert::AreEqual(string("Testing deserialization"), msg.getBody());
			Assert::AreEqual(string("2024-04-05 09:15:00"), msg.getTime());
			Assert::IsFalse(msg.getIsRead());
		}

		TEST_METHOD(TestCase7_MessageSerializationDeserializationRoundTrip)
		{
			Message original(99, 777, "Round trip test", "2024-05-15 18:30:00");
			
			string serialized = original.serialize();
			Message deserialized = Message::deserialize(serialized);

			Assert::AreEqual(original.getId(), deserialized.getId());
			Assert::AreEqual(original.getSenderId(), deserialized.getSenderId());
			Assert::AreEqual(original.getBody(), deserialized.getBody());
			Assert::AreEqual(original.getTime(), deserialized.getTime());
			Assert::AreEqual(original.getIsRead(), deserialized.getIsRead());
		}

		TEST_METHOD(TestCase8_MessageWithEmptyBody)
		{
			Message msg(1, 100, "", "2024-01-01 00:00:00");

			Assert::AreEqual(string(""), msg.getBody());
		}
	};

	TEST_CLASS(ConversationTests)
	{
	public:

		TEST_METHOD(TestCase9_ConversationDefaultConstructor)
		{
			Conversation conv;

			Assert::AreEqual(0, conv.GetConversationId());
			Assert::AreEqual(size_t(0), conv.GetParticipants().size());
			Assert::AreEqual(string(ONE_TO_ONE), conv.GetConversationType());
			Assert::AreEqual(0, conv.GetMessageCount());
		}

		TEST_METHOD(TestCase10_ConversationOneToOneCreation)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			Assert::AreEqual(1, conv.GetConversationId());
			Assert::AreEqual(size_t(2), conv.GetParticipants().size());
			Assert::AreEqual(string(ONE_TO_ONE), conv.GetConversationType());
			Assert::IsTrue(conv.HasParticipant(101));
			Assert::IsTrue(conv.HasParticipant(102));
		}

		TEST_METHOD(TestCase11_ConversationGroupCreation)
		{
			vector<int> participants = {101, 102, 103, 104};
			Conversation conv(2, participants, GROUP);

			Assert::AreEqual(2, conv.GetConversationId());
			Assert::AreEqual(size_t(4), conv.GetParticipants().size());
			Assert::AreEqual(string(GROUP), conv.GetConversationType());
		}

		TEST_METHOD(TestCase12_ConversationAddMessage)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			Message msg(1, 101, "Hello", "2024-01-01 10:00:00");
			conv.AddMessage(msg);

			Assert::AreEqual(1, conv.GetMessageCount());
		}

		TEST_METHOD(TestCase13_ConversationMultipleMessages)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			conv.AddMessage(Message(1, 101, "Hello", "2024-01-01 10:00:00"));
			conv.AddMessage(Message(2, 102, "Hi there", "2024-01-01 10:01:00"));
			conv.AddMessage(Message(3, 101, "How are you?", "2024-01-01 10:02:00"));

			Assert::AreEqual(3, conv.GetMessageCount());
			
			vector<Message> messages = conv.GetMessages();
			Assert::AreEqual(size_t(3), messages.size());
			Assert::AreEqual(string("Hello"), messages[0].getBody());
			Assert::AreEqual(string("Hi there"), messages[1].getBody());
			Assert::AreEqual(string("How are you?"), messages[2].getBody());
		}

		TEST_METHOD(TestCase14_ConversationFindMessageById)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			conv.AddMessage(Message(1, 101, "First", "2024-01-01 10:00:00"));
			conv.AddMessage(Message(2, 102, "Second", "2024-01-01 10:01:00"));

			Message* found = conv.FindMessageById(2);
			
			Assert::IsNotNull(found);
			Assert::AreEqual(string("Second"), found->getBody());
		}

		TEST_METHOD(TestCase15_ConversationFindMessageByIdNotFound)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			Message* found = conv.FindMessageById(999);
			
			Assert::IsNull(found);
		}

		TEST_METHOD(TestCase16_ConversationHasParticipant)
		{
			vector<int> participants = {101, 102, 103};
			Conversation conv(1, participants, GROUP);

			Assert::IsTrue(conv.HasParticipant(101));
			Assert::IsTrue(conv.HasParticipant(102));
			Assert::IsTrue(conv.HasParticipant(103));
			Assert::IsFalse(conv.HasParticipant(999));
		}

		TEST_METHOD(TestCase17_ConversationAddParticipant)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, GROUP);

			Assert::IsFalse(conv.HasParticipant(103));
			
			conv.AddParticipant(103);
			
			Assert::IsTrue(conv.HasParticipant(103));
			Assert::AreEqual(size_t(3), conv.GetParticipants().size());
		}

		TEST_METHOD(TestCase18_ConversationAddDuplicateParticipant)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			conv.AddParticipant(101); // Already exists
			
			Assert::AreEqual(size_t(2), conv.GetParticipants().size());
		}

		TEST_METHOD(TestCase19_ConversationSerializeHeader)
		{
			vector<int> participants = {101, 102};
			Conversation conv(5, participants, ONE_TO_ONE);

			string serialized = conv.SerializeHeader();
			
			// Should contain conversation ID, type, and participants
			Assert::IsTrue(serialized.find("CONV|5|") != string::npos);
			Assert::IsTrue(serialized.find(ONE_TO_ONE) != string::npos);
			Assert::IsTrue(serialized.find("101,102") != string::npos);
		}

		TEST_METHOD(TestCase20_ConversationSerializeMessages)
		{
			vector<int> participants = {101, 102};
			Conversation conv(1, participants, ONE_TO_ONE);

			conv.AddMessage(Message(1, 101, "Test", "2024-01-01 10:00:00"));

			string serialized = conv.SerializeMessages();
			
			Assert::IsTrue(serialized.find("MSG|1|") != string::npos);
			Assert::IsTrue(serialized.find("Test") != string::npos);
		}
	};

	TEST_CLASS(CommunicationHubTests)
	{
	public:

		TEST_METHOD(TestCase21_CommunicationHubStartOneToOneConversation)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};

			int convId = hub.StartConversation(participants, ONE_TO_ONE);

			Assert::IsTrue(convId > 0);
			
			Conversation* conv = hub.GetConversation(convId);
			Assert::IsNotNull(conv);
			Assert::AreEqual(string(ONE_TO_ONE), conv->GetConversationType());
		}

		TEST_METHOD(TestCase22_CommunicationHubStartGroupConversation)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102, 103, 104};

			int convId = hub.StartConversation(participants, GROUP);

			Assert::IsTrue(convId > 0);
			
			Conversation* conv = hub.GetConversation(convId);
			Assert::IsNotNull(conv);
			Assert::AreEqual(string(GROUP), conv->GetConversationType());
			Assert::AreEqual(size_t(4), conv->GetParticipants().size());
		}

		TEST_METHOD(TestCase23_CommunicationHubStartConversationWithNoParticipants)
		{
			CommunicationHub hub;
			vector<int> participants = {}; // Empty

			int convId = hub.StartConversation(participants, ONE_TO_ONE);

			Assert::AreEqual(-1, convId); // Should fail
		}

		TEST_METHOD(TestCase24_CommunicationHubOneToOneWithWrongParticipantCount)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102, 103}; // 3 participants for ONE_TO_ONE

			int convId = hub.StartConversation(participants, ONE_TO_ONE);

			Assert::AreEqual(-1, convId); // Should fail
		}

		TEST_METHOD(TestCase25_CommunicationHubSendMessage)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			int msgId = hub.SendMessage(convId, 101, "Hello there");

			Assert::IsTrue(msgId > 0);
			
			vector<Message> messages = hub.ListMessages(convId);
			Assert::AreEqual(size_t(1), messages.size());
			Assert::AreEqual(string("Hello there"), messages[0].getBody());
		}

		TEST_METHOD(TestCase26_CommunicationHubSendMessageToNonExistentConversation)
		{
			CommunicationHub hub;
			
			int msgId = hub.SendMessage(999, 101, "Test");

			Assert::AreEqual(-1, msgId); // Should fail
		}

		TEST_METHOD(TestCase27_CommunicationHubSendMessageByNonParticipant)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			int msgId = hub.SendMessage(convId, 999, "Unauthorized message");

			Assert::AreEqual(-1, msgId); // Should fail - sender not in conversation
		}

		TEST_METHOD(TestCase28_CommunicationHubMultipleMessages)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			
			hub.SendMessage(convId, 101, "Message 1");
			hub.SendMessage(convId, 102, "Message 2");
			hub.SendMessage(convId, 101, "Message 3");

			vector<Message> messages = hub.ListMessages(convId);
			Assert::AreEqual(size_t(3), messages.size());
			Assert::AreEqual(string("Message 1"), messages[0].getBody());
			Assert::AreEqual(string("Message 2"), messages[1].getBody());
			Assert::AreEqual(string("Message 3"), messages[2].getBody());
		}

		TEST_METHOD(TestCase29_CommunicationHubListMessagesFromNonExistentConversation)
		{
			CommunicationHub hub;
			
			vector<Message> messages = hub.ListMessages(999);

			Assert::AreEqual(size_t(0), messages.size());
		}

		TEST_METHOD(TestCase30_CommunicationHubGetConversation)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			Conversation* conv = hub.GetConversation(convId);

			Assert::IsNotNull(conv);
			Assert::AreEqual(convId, conv->GetConversationId());
		}

		TEST_METHOD(TestCase31_CommunicationHubGetNonExistentConversation)
		{
			CommunicationHub hub;
			
			Conversation* conv = hub.GetConversation(999);

			Assert::IsNull(conv);
		}

		TEST_METHOD(TestCase32_CommunicationHubGetConversationsByParticipant)
		{
			CommunicationHub hub;
			
			// Create multiple conversations with participant 101
			hub.StartConversation({101, 102}, ONE_TO_ONE);
			hub.StartConversation({101, 103}, ONE_TO_ONE);
			hub.StartConversation({102, 103}, ONE_TO_ONE); // Without 101

			vector<Conversation> conversations = hub.GetConversationsByParticipant(101);

			Assert::AreEqual(size_t(2), conversations.size());
		}

		TEST_METHOD(TestCase33_CommunicationHubGetConversationsByParticipantNoConversations)
		{
			CommunicationHub hub;
			hub.StartConversation({101, 102}, ONE_TO_ONE);

			vector<Conversation> conversations = hub.GetConversationsByParticipant(999);

			Assert::AreEqual(size_t(0), conversations.size());
		}

		TEST_METHOD(TestCase34_CommunicationHubMultipleConversations)
		{
			CommunicationHub hub;
			
			int conv1 = hub.StartConversation({101, 102}, ONE_TO_ONE);
			int conv2 = hub.StartConversation({103, 104}, ONE_TO_ONE);
			int conv3 = hub.StartConversation({101, 103, 105}, GROUP);

			Assert::AreNotEqual(conv1, conv2);
			Assert::AreNotEqual(conv2, conv3);
			Assert::AreNotEqual(conv1, conv3);

			Assert::IsNotNull(hub.GetConversation(conv1));
			Assert::IsNotNull(hub.GetConversation(conv2));
			Assert::IsNotNull(hub.GetConversation(conv3));
		}

		TEST_METHOD(TestCase35_CommunicationHubGroupConversationMultipleParticipants)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102, 103, 104, 105};
			
			int convId = hub.StartConversation(participants, GROUP);

			Conversation* conv = hub.GetConversation(convId);
			Assert::IsNotNull(conv);
			
			Assert::IsTrue(conv->HasParticipant(101));
			Assert::IsTrue(conv->HasParticipant(102));
			Assert::IsTrue(conv->HasParticipant(103));
			Assert::IsTrue(conv->HasParticipant(104));
			Assert::IsTrue(conv->HasParticipant(105));
		}

		TEST_METHOD(TestCase36_CommunicationHubMessageOrderPreserved)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			
			hub.SendMessage(convId, 101, "First");
			hub.SendMessage(convId, 102, "Second");
			hub.SendMessage(convId, 101, "Third");
			hub.SendMessage(convId, 102, "Fourth");

			vector<Message> messages = hub.ListMessages(convId);
			
			Assert::AreEqual(size_t(4), messages.size());
			Assert::AreEqual(string("First"), messages[0].getBody());
			Assert::AreEqual(string("Second"), messages[1].getBody());
			Assert::AreEqual(string("Third"), messages[2].getBody());
			Assert::AreEqual(string("Fourth"), messages[3].getBody());
		}

		TEST_METHOD(TestCase37_CommunicationHubEmptyMessageBody)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			int msgId = hub.SendMessage(convId, 101, "");

			Assert::IsTrue(msgId > 0);
			
			vector<Message> messages = hub.ListMessages(convId);
			Assert::AreEqual(size_t(1), messages.size());
			Assert::AreEqual(string(""), messages[0].getBody());
		}

		TEST_METHOD(TestCase38_CommunicationHubLongMessageBody)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102};
			
			int convId = hub.StartConversation(participants, ONE_TO_ONE);
			string longMessage = string(1000, 'A'); // 1000 characters
			
			int msgId = hub.SendMessage(convId, 101, longMessage);

			Assert::IsTrue(msgId > 0);
			
			vector<Message> messages = hub.ListMessages(convId);
			Assert::AreEqual(longMessage, messages[0].getBody());
		}

		TEST_METHOD(TestCase39_CommunicationHubConversationWithSingleMessage)
		{
			CommunicationHub hub;
			vector<int> participants = {101, 102, 103};
			
			int convId = hub.StartConversation(participants, GROUP);
			hub.SendMessage(convId, 102, "Only message");

			Conversation* conv = hub.GetConversation(convId);
			Assert::AreEqual(1, conv->GetMessageCount());
		}

		TEST_METHOD(TestCase40_CommunicationHubIncrementalConversationIds)
		{
			CommunicationHub hub;
			
			int conv1 = hub.StartConversation({101, 102}, ONE_TO_ONE);
			int conv2 = hub.StartConversation({103, 104}, ONE_TO_ONE);
			int conv3 = hub.StartConversation({105, 106}, ONE_TO_ONE);

			Assert::AreEqual(conv1 + 1, conv2);
			Assert::AreEqual(conv2 + 1, conv3);
		}
	};
}

