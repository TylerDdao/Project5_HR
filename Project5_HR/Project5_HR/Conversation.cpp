#include "../../include/communication/Conversation.h"
#include "../../include/utils/DateTimeHelper.h"
#include <sstream>
#include <algorithm>

using namespace std;

Conversation::Conversation() 
    : conversationId(0), participantIds(), messages(), conversationType(ONE_TO_ONE), createdAt("") {}

Conversation::Conversation(int convId, const vector<int>& participants, const string& type)
    : conversationId(convId), participantIds(participants), messages(), 
      conversationType(type), createdAt(DateTimeHelper::GetCurrentDateTime()) {}

int Conversation::GetConversationId() const {
    return conversationId;
}

vector<int> Conversation::GetParticipants() const {
    return participantIds;
}

vector<Message> Conversation::GetMessages() const {
    return messages;
}

string Conversation::GetConversationType() const {
    return conversationType;
}

string Conversation::GetCreatedAt() const {
    return createdAt;
}

void Conversation::AddMessage(const Message& msg) {
    messages.push_back(msg);
}

Message* Conversation::FindMessageById(int msgId) {
    for (auto& msg : messages) {
        if (msg.GetId() == msgId) {
            return &msg;
        }
    }
    return nullptr;
}

int Conversation::GetMessageCount() const {
    return static_cast<int>(messages.size());
}

void Conversation::AddParticipant(int participantId) {
    if (!HasParticipant(participantId)) {
        participantIds.push_back(participantId);
    }
}

bool Conversation::HasParticipant(int participantId) const {
    return find(participantIds.begin(), participantIds.end(), participantId) != participantIds.end();
}

string Conversation::SerializeHeader() const {
    stringstream ss;
    ss << "CONV|" << conversationId << "|" << conversationType << "|" << createdAt << "|";
    
    for (size_t i = 0; i < participantIds.size(); ++i) {
        ss << participantIds[i];
        if (i < participantIds.size() - 1) {
            ss << ",";
        }
    }
    
    return ss.str();
}

string Conversation::SerializeMessages() const {
    stringstream ss;
    for (const auto& msg : messages) {
        ss << "MSG|" << conversationId << "|" << msg.Serialize() << "\n";
    }
    return ss.str();
}

