#include "../../include/communication/Conversation.h"
#include "../../include/utils/DateTimeHelper.h"
#include <sstream>
#include <algorithm>

using namespace std;

Conversation::Conversation() 
    : conversationId(0), participantIds(), messages(), conversationType(ONE_TO_ONE), createdAt("") {}

Conversation::Conversation(int convId, const vector<int>& participants, const string& type)
    : conversationId(convId), participantIds(participants), messages(), 
      conversationType(type), createdAt(DateTimeHelper::getCurrentDateTime()) {}

int Conversation::getConversationId() const {
    return conversationId;
}

vector<int> Conversation::getParticipants() const {
    return participantIds;
}

vector<Message> Conversation::getMessages() const {
    return messages;
}

string Conversation::getConversationType() const {
    return conversationType;
}

string Conversation::getCreatedAt() const {
    return createdAt;
}

void Conversation::addMessage(const Message& msg) {
    messages.push_back(msg);
}

Message* Conversation::findMessageById(int msgId) {
    for (auto& msg : messages) {
        if (msg.getId() == msgId) {
            return &msg;
        }
    }
    return nullptr;
}

int Conversation::getMessageCount() const {
    return static_cast<int>(messages.size());
}

void Conversation::addParticipant(int participantId) {
    if (!hasParticipant(participantId)) {
        participantIds.push_back(participantId);
    }
}

bool Conversation::hasParticipant(int participantId) const {
    return find(participantIds.begin(), participantIds.end(), participantId) != participantIds.end();
}

string Conversation::serializeHeader() const {
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

string Conversation::serializeMessages() const {
    stringstream ss;
    for (const auto& msg : messages) {
        ss << "MSG|" << conversationId << "|" << msg.serialize() << "\n";
    }
    return ss.str();
}

