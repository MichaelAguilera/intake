# frozen_string_literal: true

require 'rails_helper'

describe ExternalRoutes do
  describe '.intake_api_person_path' do
    it 'returns /api/v1/people/:id' do
      expect(described_class.intake_api_person_path('1')).to eq('/api/v1/people/1')
    end
  end

  describe '.intake_api_people_path' do
    it 'returns /api/v1/people' do
      expect(described_class.intake_api_people_path).to eq('/api/v1/people')
    end
  end

  describe '.intake_api_people_search_path' do
    it 'returns /api/v1/people_search' do
      expect(described_class.intake_api_people_search_path(search_term: 123)).to eq(
        '/api/v1/people_search?search_term=123'
      )
    end
  end

  describe '.intake_api_people_search_v2_path' do
    it 'returns /api/v2/people_search' do
      expect(described_class.intake_api_people_search_v2_path(search_term: 123)).to eq(
        '/api/v2/people_search?search_term=123'
      )
    end
  end

  describe '.intake_api_screening_path' do
    it 'returns /api/v1/screenings/:id' do
      expect(described_class.intake_api_screening_path(123)).to eq('/api/v1/screenings/123')
    end
  end

  describe '.intake_api_screenings_path when params are not provided' do
    it 'returns /api/v1/screenings when params are not provided' do
      expect(described_class.intake_api_screenings_path).to eq(
        '/api/v1/screenings'
      )
    end

    it 'returns /api/v1/screenings?params when params are provided' do
      expect(described_class.intake_api_screenings_path(search_term: 123)).to eq(
        '/api/v1/screenings?search_term=123'
      )
    end
  end

  describe '.intake_api_history_of_involvements_path' do
    it 'returns /api/v1/screenings/:id/history_of_involvements' do
      expect(described_class.intake_api_history_of_involvements_path(82)).to eq(
        '/api/v1/screenings/82/history_of_involvements'
      )
    end
  end

  describe '.intake_api_screening_submit_path' do
    it 'returns /api/v1/screenings/:id/submit' do
      expect(described_class.intake_api_screening_submit_path(32)).to eq(
        '/api/v1/screenings/32/submit'
      )
    end
  end

  describe '.intake_api_participants_path' do
    it 'returns /api/v1/participants' do
      expect(described_class.intake_api_participants_path).to eq('/api/v1/participants')
    end
  end

  describe '.intake_api_participant_path' do
    it 'returns /api/v1/participants/:id' do
      expect(described_class.intake_api_participant_path(31)).to eq('/api/v1/participants/31')
    end
  end

  describe '.intake_api_relationships_by_screening_path' do
    it 'returns /api/v1/screenings/:id/relationships' do
      expect(described_class.intake_api_relationships_by_screening_path(12)).to eq(
        '/api/v1/screenings/12/relationships'
      )
    end
  end
end
