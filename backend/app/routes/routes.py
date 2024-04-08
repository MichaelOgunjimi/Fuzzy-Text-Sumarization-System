import os

from app import db
from app.models.models import Text, Summary
from app.summarizer.text_summarizer import TextSummarizer
from app.utils.helpers import allowed_file, read_text_from_file, get_or_generate_percentage
from flask import Blueprint, request, jsonify, current_app, abort
from flask_cors import cross_origin
from werkzeug.utils import secure_filename

bp = Blueprint('routes', __name__, url_prefix='/api/v1')


@bp.route('/home', methods=['GET'])
@cross_origin()
def home():
    """Simple endpoint to check API status.
    Returns:
        JSON response with a 'message' key and 'API is up and running!' value.
    """
    return jsonify({'message': 'API is up and running!'}), 200


@bp.route('/texts', methods=['GET'])
@cross_origin()
def get_texts():
    """
    Endpoint to retrieve all texts along with their summaries.

    Returns:
        JSON response containing a list of texts and their summaries.
    """
    # Fetch all texts from the database
    all_texts = Text.query.all()

    # Prepare the data for JSON serialization
    texts_data = []
    for text in all_texts:
        summaries = Summary.query.filter_by(text_id=text.id).all()
        summaries_data = [{
            'id': summary.id,
            'content': summary.content,
            'created_at': summary.created_at.isoformat()
        } for summary in summaries]

        texts_data.append({
            'id': text.id,
            'content': text.content,
            'summaries': summaries_data
        })

    # Construct and return the JSON response
    return jsonify(texts_data)


@bp.route('/texts/user', methods=['GET'])
@cross_origin()
def get_user_texts():
    """
    Endpoint to retrieve all texts uploaded by a specific user, identified by a UID in request headers.

    Returns:
        JSON response containing a list of texts uploaded by the user.
    """
    user_uid = request.headers.get('X-User-UID')
    if not user_uid:
        return jsonify({"error": "User UID not provided"}), 400

    # Correctly filter texts by user UID
    all_texts = Text.query.filter_by(user_uid=user_uid).all()

    # Prepare the data for JSON serialization
    texts_data = [{'id': text.id, 'content': text.content} for text in all_texts]

    return jsonify(texts_data)


@bp.route('/texts/user/<int:text_id>', methods=['GET'])
@cross_origin()
def delete_user_text(text_id):
    """
    Endpoint to delete a text uploaded by a specific user, identified by a UID in request headers.

    Parameters:
        text_id (int): The ID of the text to be deleted.

    Returns:
        JSON response indicating the success or failure of the deletion.
    """
    user_uid = request.headers.get('X-User-UID')
    if not user_uid:
        return jsonify({"error": "User UID not provided"}), 400

    # Correctly filter texts by user UID
    text = Text.query.filter_by(id=text_id, user_uid=user_uid).first()
    if not text:
        return jsonify({"error": "Text not found"}), 404

    db.session.delete(text)
    db.session.commit()

    return jsonify({"message": "Text deleted successfully"}), 200


@bp.route('/texts/<int:text_id>/summaries', methods=['GET'])
@cross_origin()
def get_text_summaries(text_id):
    """
    Endpoint to retrieve a text and its associated summaries by ID.

    Parameters:
        text_id (int): The ID of the text to be retrieved.

    Returns:
        JSON response containing the text and its summaries.
    """
    # Fetch the text by ID
    text = Text.query.get(text_id)
    if not text:
        abort(404, description=f"Text with ID {text_id} not found.")

    # Check if there are any summaries for the text
    if not text.summaries:
        abort(404, description=f"No summaries found for text with ID {text_id}.")

    # Fetch all summaries associated with this text
    summaries = Summary.query.filter_by(text_id=text_id).all()

    # Prepare the summaries for JSON serialization
    summaries_data = [{'id': summary.id, 'text': summary.content, 'created_at': summary.created_at.isoformat()} for
                      summary in summaries]

    # Construct and return the JSON response
    return jsonify({
        'text': {
            'id': text.id,
            'content': text.content,
            'created_at': text.created_at.isoformat(),
            'summaries': summaries_data
        }
    })


@bp.route('/upload', methods=['POST'])
@cross_origin()
def upload_file():
    """
    Endpoint to handle file uploads.

    Returns:
        JSON response indicating the success or failure of the file upload,
        and the extracted text content from the uploaded file.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "No selected file or file type not allowed"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

    # Save the file to the uploads folder
    file.save(filepath)

    # Read the text from the file
    text_content = read_text_from_file(filepath).replace('\n', ' ')

    # Here, you would process the file to extract text and potentially save it using your models
    return jsonify({"message": "File uploaded successfully", "filename": filename, "text": text_content}), 201


@bp.route('/summarize', methods=['POST'], endpoint='summarize_post')
@cross_origin()
def summarize():
    """
    Endpoint to summarize a given text.

    Returns:
        JSON response containing the generated summary.
    """
    data = request.get_json()
    user_uid = request.headers.get('X-User-UID')
    percentage = get_or_generate_percentage(data.get('percentage'))
    text_content = data.get('text', '')

    # Assuming TextSummarizer has a method summarize() that takes text content and returns a summary
    summarizer = TextSummarizer(text_content, percentage, 8)
    summary = summarizer.summarize()

    # Save the original text and its summary to the database
    new_text = Text(content=text_content, user_uid=user_uid)
    new_summary = Summary(content=summary, text=new_text)
    db.session.add(new_text)
    db.session.add(new_summary)
    db.session.commit()

    return jsonify({"summary": summary})


@bp.route('/summarize/<int:text_id>', methods=['POST'], endpoint='summarize_with_id')
@cross_origin()
def summarize(text_id):
    """
    Endpoint to summarize a text with a given ID.

    Parameters:
        text_id (int): The ID of the text to be summarized.

    Returns:
        JSON response containing the generated summary.
    """
    # Optional percentage parameter, defaults to 50 if not provided
    data = request.get_json() or {}
    percentage = get_or_generate_percentage(data.get('percentage'))

    # Fetch the original text using the provided text ID
    original_text = Text.query.get(text_id)
    if not original_text:
        return jsonify({"error": "Text not found"}), 404

    # Use the TextSummarizer to summarize the fetched text
    summarizer = TextSummarizer(original_text.content, percentage, 8)
    summary = summarizer.summarize()

    # Save the summary to the database, linked to the original text
    new_summary = Summary(content=summary, text_id=text_id)
    db.session.add(new_summary)
    db.session.commit()

    return jsonify({"text_id": text_id, "summary": summary})
