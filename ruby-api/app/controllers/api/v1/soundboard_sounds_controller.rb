class Api::V1::SoundboardSoundsController < ApplicationController

  before_action :find_soundboardsound, only: [:update, :destroy]
  def index
    @soundboardsounds = SoundboardSound.all
    render json: @soundboardsounds
  end

  def update
    @soundboardsound.update(soundboardsound_params)
    if @soundboardsound.save
      render json: @soundboardsound, status: :accepted
    else
      render json: { errors: @soundboardsound.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def create
    # byebug
    new_soundboardsound = SoundboardSound.create(soundboardsound_params)
    if new_soundboardsound.save
      render json: new_soundboardsound, status: :accepted
    else
      render json: { errors: new_soundboardsound.errors.full_messages }, status: :unprocessible_entity
    end
  end

  def destroy
    # byebug
    @soundboardsound.delete
    head :no_content
  end

  private

  def soundboardsound_params
    params.permit(:soundboard_id, :sound_id)
  end

  def find_soundboardsound
    @soundboardsound = SoundboardSound.find(params[:id])
  end

end
