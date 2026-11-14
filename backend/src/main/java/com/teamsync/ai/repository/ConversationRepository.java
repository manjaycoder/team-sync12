package com.teamsync.ai.repository;

import com.teamsync.ai.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByUserIdOrderByUpdatedAtDesc(String userId);

    List<Conversation> findByCompanyIdAndUserIdOrderByUpdatedAtDesc(String companyId, String userId);
}

