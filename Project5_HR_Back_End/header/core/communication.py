"""
@brief This module defines the Staff class.
"""

class Communication:
    """
    @brief This is the Communication Class
    """

    def __init__(self, sender_id = 0, recipient_id: int | None = None, type = "announcement", subject = "", body = "", sent_at: str | None = None):
        self._sender_id =sender_id
        self._recipient_id = recipient_id
        self._type = type
        self._subject = subject
        self._body = body
        self._sent_at = sent_at

    # =========
    # Getters
    # =========

    def set_sender_id(self, sender_id) -> bool:
        self._sender_id = sender_id
        return True
    
    def set_recipient_id(self, recipient_id) -> bool:
        self._recipient_id = recipient_id
        return True
    
    def set_type(self, type) -> bool:
        self._type = type
        return True
    
    def set_subject(self, subject) -> bool:
        self._subject = subject
        return True
    
    def set_body(self, body) -> bool:
        self._body = body
        return True
    
    def set_sent_at(self, sent_at) -> bool:
        self._sent_at = sent_at
        return True

    def get_sender_id(self) -> int:
        return self._sender_id
    
    def get_recipient_id(self) -> int:
        return self._recipient_id
    
    def get_type(self) -> str:
        return self._type
    
    def get_subject(self) -> str:
        return self._subject
    
    def get_body(self) -> str:
        return self._body
    
    def get_sent_at(self) -> str:
        return self._sent_at