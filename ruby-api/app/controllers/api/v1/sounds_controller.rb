class Api::V1::SoundsController < ApplicationController

  before_action :find_sound, only: [:update, :destroy]
  def index
    @sounds = Sound.all
    render json: @sounds
  end

  def update
    @sound.update(sound_params)
    if @sound.save
      render json: @sound, status: :accepted
    else
      render json: { errors: @sound.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def create
    new_sound = Sound.create(sound_params)
    if new_sound.save
      render json: new_sound, status: :accepted
    else
      render json: { errors: new_sound.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    # byebug
    @sound.delete
    head :no_content
  end

  private

  def sound_params
    params.permit(:name, :source)
  end

  def find_sound
    @sound = Sound.find(params[:id])
  end

end
