require 'test_helper'

class CardsAPITest < ActionDispatch::IntegrationTest
  class PostCardsTest < ActionDispatch::IntegrationTest
    class ValidListIdTest < ActionDispatch::IntegrationTest
      class ValidDataTest < ActionDispatch::IntegrationTest
        def setup
          board = Board.create!(title: "My board")
          @list = board.lists.create!(title: "My list")
        end

        test "creates a new card" do
          assert_equal 0, @list.cards.count

          post "/api/cards",
              params: { list_id: @list.id, card: { title: "My new card" } }

          assert_equal 1, @list.cards.count
        end

        test "returns a 201" do
          post "/api/cards",
              params: { list_id: @list.id, card: { title: "My new card" } }

          assert_response 201
        end

        test "returns the new list" do
          post "/api/cards",
              params: { list_id: @list.id, card: { title: "My new card" } }

          assert_equal @list.reload.cards.last.to_json, response.body
        end
      end

      class InvalidDataTest < ActionDispatch::IntegrationTest
        def setup
          board = Board.create!(title: "My board")
          list = board.lists.create!(title: "My list")

          post "/api/cards",
              params: { list_id: list.id, card: { title: '' } }
        end

        test "returns a 422" do
          assert_response 422
        end

        test "includes error text in response" do
          assert JSON.parse(response.body).has_key?("error")
        end
      end
    end

    class InvalidListIdTest < ActionDispatch::IntegrationTest
      def setup
        post "/api/cards",
            params: { list_id: 'abc', card: { title: 'My new card' } }
      end

      test "returns a 422" do
        assert_response 422
      end

      test "includes error text in response" do
        assert JSON.parse(response.body).has_key?("error")
      end
    end
  end
end
