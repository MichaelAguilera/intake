# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'History card' do
  let(:existing_screening) { FactoryGirl.create(:screening) }

  scenario 'edit an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit edit_screening_path(id: existing_screening.id)

    within '#history-card.card.show.card', text: 'History' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end

  scenario 'view an existing screening' do
    stub_request(:get, intake_api_screening_url(existing_screening.id))
      .and_return(json_body(existing_screening.to_json))
    visit screening_path(id: existing_screening.id)

    within '#history-card.card.show', text: 'History' do
      expect(page).to have_css('th', text: 'Date')
      expect(page).to have_css('th', text: 'Type/Status')
      expect(page).to have_css('th', text: 'County/Office')
      expect(page).to have_css('th', text: 'People and Roles')
    end
  end

  context 'a screening with participants' do
    let(:screenings) do
      [
        {
          start_date: '2016-09-10',
          county_name: 'el_dorado',
          # until we have users, TPT is saving the entire name in the last_name field
          assigned_social_worker: { first_name: nil, last_name: 'Bob Smith' },
          reporter: { first_name: 'Alex', last_name: 'Hanson' },
          all_people: [
            { first_name: 'Bob', last_name: 'Bob Smith', roles: ['Assigned Social Worker'] },
            { first_name: 'Alex', last_name: 'Hanson', roles: ['Reporter'] },
            { first_name: 'Sally', last_name: 'Johnson', roles: ['Victim'] },
            { first_name: 'Sam', last_name: 'Anderson', roles: ['Perpetrator'] },
            { first_name: 'James', last_name: 'Robinson', roles: [] }
          ]
        }
      ]
    end

    let(:referrals) do
      [
        {
          start_date: '2016-11-14',
          end_date: '2016-12-14',
          county_name: 'Madera',
          reporter: {
            first_name: 'Reporter',
            last_name: 'rLastName'
          },
          assigned_social_worker: {
            first_name: 'Social',
            last_name: 'sLastName'
          },
          allegations: [
            {
              allegation_description: 'General Neglect',
              disposition_description: 'Entered in Error',
              perpetrator_first_name: 'Perpetrator',
              perpetrator_last_name: 'pLastName',
              victim_first_name: 'Victim',
              victim_last_name: 'vLastName'
            }
          ]
        }
      ]
    end

    let(:screening_involvement) do
      {
        referrals: referrals,
        screenings: screenings
      }
    end

    before do
      lana = FactoryGirl.create(:participant, first_name: 'Lana', legacy_id: 2)
      archer = FactoryGirl.create(:participant, first_name: 'Archer', legacy_id: 1)
      existing_screening.participants = [lana, archer]

      stub_request(:get, intake_api_screening_url(existing_screening.id))
        .and_return(json_body(existing_screening.to_json))

      stub_request(
        :get,
        intake_api_history_of_involvements_url(existing_screening.id)
      ).and_return(json_body(screening_involvement.to_json, status: 200))

      stub_request(
        :get,
        intake_api_relationships_by_screening_url(existing_screening.id)
      ).and_return(json_body([].to_json, status: 200))
    end

    scenario 'viewing a screening' do
      visit screening_path(id: existing_screening.id)

      within '#history-card.card.show', text: 'History' do
        within 'tbody#history-of-involvement' do
          rows = page.all('tr')

          within rows[0] do
            start_time = Time.parse(screening_involvement[:screenings]
              .first[:start_date]).strftime('%m/%d/%Y')
            expect(page).to have_content(start_time)
            expect(page).to have_content('Screening (In Progress)')
            expect(page).to have_content('El Dorado')
            expect(page).to have_content('Sally Johnson')
            expect(page).to have_content('Sam Anderson')
            expect(page).to have_content('James Robinson')
            expect(page).to have_content('Reporter: Alex Hanson')
            expect(page).to have_content('Worker: Bob Smith')
          end

          within rows[1] do
            start_time = Time.parse(screening_involvement[:referrals]
              .first[:start_date]).strftime('%m/%d/%Y')
            expect(page).to have_content(start_time)
            expect(page).to have_content('Referral (Closed)')
            expect(page).to have_content('Madera')

            within 'table' do
              allegation_rows = page.all('tr')

              within allegation_rows[0] do
                expect(page).to have_content('Victim')
                expect(page).to have_content('Perpetrator')
                expect(page).to have_content('Allegation(s) & Disposition')
              end

              within allegation_rows[1] do
                expect(page).to have_content('Victim vLastName')
                expect(page).to have_content('Perpetrator pLastName')
                expect(page).to have_content('General Neglect (Entered in Error)')
              end
            end

            expect(page).to have_content('Reporter: Reporter rLastName')
            expect(page).to have_content('Worker: Social sLastName')
          end
        end
      end

      expect(
        a_request(
          :get,
          intake_api_history_of_involvements_url(existing_screening.id)
        )
      ).to have_been_made
    end

    scenario 'editing a screening' do
      visit edit_screening_path(id: existing_screening.id)

      expect(
        a_request(
          :get,
          intake_api_history_of_involvements_url(existing_screening.id)
        )
      ).to have_been_made

      within '#history-card.card.show', text: 'History' do
        within 'tbody#history-of-involvement' do
          rows = page.all('tr')

          within rows[0] do
            start_time = Time.parse(screening_involvement[:screenings]
              .first[:start_date]).strftime('%m/%d/%Y')
            expect(page).to have_content(start_time)
            expect(page).to have_content('Screening (In Progress)')
            expect(page).to have_content('El Dorado')
            expect(page).to have_content('Sally Johnson')
            expect(page).to have_content('Sam Anderson')
            expect(page).to have_content('James Robinson')
            expect(page).to have_content('Reporter: Alex Hanson')
            expect(page).to have_content('Worker: Bob Smith')
          end

          within rows[1] do
            start_time = Time.parse(screening_involvement[:referrals]
              .first[:start_date]).strftime('%m/%d/%Y')
            expect(page).to have_content(start_time)
            expect(page).to have_content('Referral (Closed)')
            expect(page).to have_content('Madera')

            within 'table' do
              allegation_rows = page.all('tr')

              within allegation_rows[0] do
                expect(page).to have_content('Victim')
                expect(page).to have_content('Perpetrator')
                expect(page).to have_content('Allegation(s) & Disposition')
              end

              within allegation_rows[1] do
                expect(page).to have_content('Victim vLastName')
                expect(page).to have_content('Perpetrator pLastName')
                expect(page).to have_content('General Neglect (Entered in Error)')
              end
            end

            expect(page).to have_content('Reporter: Reporter rLastName')
            expect(page).to have_content('Worker: Social sLastName')
          end
        end
      end
    end
  end
end
