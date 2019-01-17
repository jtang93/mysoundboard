class Api::V1::UsersController < ApplicationController

  before_action :find_user, only: [:update]
  def index
    @users = User.all
    render json: @users
  end

  def update
    @user.update(user_params)
    if @user.save
      render json: @user, status: :accepted
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def create
    # byebug
    new_user = User.create(user_params)
    if new_user.save
      render json: new_user, status: :accepted
    else
      render json: { errors: new_user.errors.full_messages }, status: :unprocessible_entity
    end
  end

  private

  def user_params
    params.permit(:username)
  end

  def find_user
    @user = User.find(params[:id])
  end

end
