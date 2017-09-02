Rails.application.routes.draw do
  root to: 'home#index'

  namespace :api do
    resources :boards, only: :index
  end

  get '/ui/all_boards', to: 'ui#all_boards'
  get '/ui/single_board', to: 'ui#single_board'
end
