# frozen_string_literal: true
require 'rails_helper'

describe PeopleController do
  describe '#new' do
    it 'renders the show template' do
      post :new
      expect(response).to render_template('show')
    end
  end

  describe '#create' do
    let(:new_person) do
      {
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        }
      }.with_indifferent_access
    end
    let(:created_person) { new_person.merge(id: 1) }

    before do
      allow(PersonService).to receive(:create)
        .with(new_person).and_return(created_person)
    end

    it 'renders person as json' do
      post :create, params: { person: new_person }, format: :json
      expect(JSON.parse(response.body)).to eq({
        id: 1,
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        }
      }.with_indifferent_access)
    end
  end

  describe '#show' do
    let(:person) do
      {
        id: 1,
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        }
      }.with_indifferent_access
    end
    before do
      allow(PersonService).to receive(:find).with('1').and_return(person)
    end

    it 'renders the show template' do
      get :show, params: { id: 1 }
      expect(response).to render_template('show')
    end

    it 'renders person as json' do
      post :show, params: { id: 1 }, format: :json
      expect(JSON.parse(response.body)).to eq({
        id: 1,
        first_name: 'Homer',
        last_name: 'Simpson',
        gender: 'male',
        date_of_birth: '05/29/1990',
        ssn: '123-23-1234',
        address: {
          street_address: '123 fake st',
          city: 'Springfield',
          state: 'NY',
          zip: '12345'
        }
      }.with_indifferent_access)
    end
  end

  describe '#search' do
    it 'searches for people and renders a json with person attributes' do
      people = [
        Person.new(first_name: 'Bart', last_name: 'Simpson'),
        Person.new(first_name: 'John', last_name: 'Smith')
      ]
      allow(PeopleRepo).to receive(:search)
        .with('foobarbaz')
        .and_return(people)

      get 'search', query: 'foobarbaz'

      body = JSON.parse(response.body)
      expect(body.first['first_name']).to eq('Bart')
      expect(body.first['last_name']).to eq('Simpson')
      expect(body.last['first_name']).to eq('John')
      expect(body.last['last_name']).to eq('Smith')
    end
  end
end
