# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::PeopleController do
  let(:security_token) { 'security_token' }
  let(:session) do
    { security_token => security_token }
  end

  describe '#create' do
    let(:person_params) do
      {
        id: '',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [{
          id: '',
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345',
          type: 'placement'
        }],
        phone_numbers: [
          { id: '', number: '111-111-1111', type: 'Cell' },
          { id: '', number: '222-222-2222', type: 'Home' }
        ],
        languages: %w[English Farsi],
        races: [
          { race: 'Asian', race_detail: 'Chinese' },
          { race: 'Black or African American' }
        ],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Mexican'
        }
      }.with_indifferent_access
    end
    let(:created_person) do
      double(:person, as_json: person_params.merge(id: '1'))
    end

    before do
      person = double(:person)
      expect(Person).to receive(:new)
        .with(person_params)
        .and_return(person)
      expect(PersonRepository).to receive(:create)
        .with(security_token, person)
        .and_return(created_person)
    end

    it 'renders person as json' do
      post :create, params: { person: person_params }, session: session
      expect(JSON.parse(response.body)).to eq(created_person.as_json)
    end
  end

  describe '#update' do
    let(:person_params) do
      {
        id: '1',
        first_name: 'Homer',
        middle_name: 'Jay',
        last_name: 'Simpson',
        name_suffix: 'esq',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        addresses: [{
          id: '1',
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345',
          type: 'placement'
        }],
        phone_numbers: [{
          id: '2',
          number: '333-333-3333',
          type: 'Home'
        }],
        languages: ['Armenian'],
        races: [
          { race: 'Asian', race_detail: 'Chinese' },
          { race: 'Black or African American' }
        ],
        ethnicity: {
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Mexican'
        }
      }.with_indifferent_access
    end
    let(:updated_person) { double(:person, as_json: { 'id' => 'updated_person' }) }

    before do
      person = double(:person)
      expect(Person).to receive(:new)
        .with(person_params)
        .and_return(person)
      expect(PersonRepository).to receive(:update)
        .with(security_token, person)
        .and_return(updated_person)
    end

    it 'updates person and renders person as json' do
      process :update,
        method: :put,
        params: { id: person_params[:id], person: person_params },
        session: session
      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(updated_person.as_json)
    end
  end

  describe '#search' do
    it 'searches for people and renders a json with person attributes' do
      people = [
        Person.new(first_name: 'Bart', last_name: 'Simpson'),
        Person.new(first_name: 'John', last_name: 'Smith')
      ]
      allow(PersonSearchRepository).to receive(:search)
        .with(security_token, 'foobarbaz')
        .and_return(people)

      process :search, method: :get, params: { search_term: 'foobarbaz' }, session: session

      expect(response).to be_successful
      expect(JSON.parse(response.body)).to eq(people.as_json)
    end
  end

  describe '#show' do
    let(:person_id) { '1' }
    let(:person) { double(:person, as_json: { 'id' => person_id }) }
    before do
      allow(PersonRepository).to receive(:find)
        .with(security_token, person_id)
        .and_return(person)
    end

    it 'renders person as json' do
      process :show, method: :get, params: { id: person_id }, session: session
      expect(JSON.parse(response.body)).to eq(person.as_json)
    end
  end
end
