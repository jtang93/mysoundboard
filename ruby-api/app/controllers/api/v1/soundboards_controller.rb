class Api::V1::SoundboardsController < ApplicationController

  before_action :find_soundboard, only: [:update, :destroy]
  def index
    @soundboards = Soundboard.all
    render json: @soundboards
  end

  def update
    @soundboard.update(soundboard_params)
    if @soundboard.save
      render json: @soundboard, status: :accepted
    else
      render json: { errors: @soundboard.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def create
    # byebug
    new_soundboard = Soundboard.create(soundboard_params)
    if new_soundboard.save
      render json: new_soundboard, status: :accepted
    else
      render json: { errors: new_soundboard.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    # byebug
    @soundboard.delete
    head :no_content
  end

  private

  def soundboard_params
    params.permit(:name, :user_id, :array)
  end

  def find_soundboard
    @soundboard = Soundboard.find(params[:id])
  end

end
